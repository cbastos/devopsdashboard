import { Api } from '../api';
import prometheusClient from 'prom-client';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import Repository from '../adapters/repository/repository';
import { Application } from 'express';

type FakeExpressInstance = {
    use: jasmine.Spy,
    listen: Function
}

describe('The API initiatization', () => {
    jest.mock('../adapters/repository/repository');
    jest.mock('express');
    const fake_prometheus_bundle_instance = 'unique_prometheus_bundle_id';
    const fake_prometheus_bundle = () => fake_prometheus_bundle_instance;
    const swaggerPath = path.join(__dirname, '../swagger.json');
    let api: Api;
    let fake_repository: Repository;
    let fake_express_instance: FakeExpressInstance;

    beforeAll(async () => {
        fake_express_instance = ({ use: jasmine.createSpy(), listen: (port: number, callback: () => any) => callback() });
        const fake_express = jest.fn().mockImplementation(() => fake_express_instance) as () => Application;
        fake_repository = { connect: () => Promise.resolve(), createConnection: () => Promise.resolve() } as any;
        spyOn(fake_repository, 'connect');
        const fakeEndpointsConfigurator = { configure: (): any => { } } as any;
        const fakeProjects: any = { getAll: () => Promise.resolve([]), getProjects: (): any => null };
        const fakeCache: any = { flushAll: () => Promise.resolve(), getOrSet: () => Promise.resolve([]) };
        api = new Api(fake_express, fake_prometheus_bundle, fake_repository, fakeEndpointsConfigurator, fakeProjects, fakeCache);
        spyOn(prometheusClient, 'collectDefaultMetrics');
        if (fs.existsSync(swaggerPath)) fs.unlinkSync(swaggerPath);
        await api.init();
    });

    test('should start collecting nodejs metrics', () => {
        expect(prometheusClient.collectDefaultMetrics).toHaveBeenCalled();
    });

    test('should start collecting express api metrics', () => {
        expect(isCalled(fake_express_instance.use, fake_prometheus_bundle_instance)).toBeTruthy();
    });

    test('should update the api docs specification (swagger.json file) on initialization', async () => {
        expect(fs.existsSync(swaggerPath)).toBeTruthy();
    });

    test('should serve Swagger UI on /api location', async () => {
        expect(isCalled(fake_express_instance.use, '/api')).toBeTruthy();
    });

    test('should configure the cors access to the api', async () => {
        expect(fake_express_instance.use.calls.argsFor(2)[0].prototype).toEqual(cors().prototype);
    });

    test('should connect to repository', async () => {
        expect(fake_repository.connect).toHaveBeenCalled();
    });
});

function isCalled(spy: jasmine.Spy, firstArg: any) {
    for (let i = 0, l = spy.calls.count(); i < l; ++i) {
        if (spy.calls.argsFor(i)[0] === firstArg) return true;
    }
    return false;
}

function isCalledWithPrototype(spy: jasmine.Spy, prototype: any) {
    for (let i = 0, l = spy.calls.count(); i < l; ++i) {
        if (spy.calls.argsFor(i)[0].prototype === prototype) return true;
    }
    return false;
}
