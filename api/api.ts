import { middleware as httpContextMiddlware } from './httpContext';
import 'reflect-metadata';
import cors from 'cors';
// @ts-ignore
import SwaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express';
import schedule from 'node-schedule';
import EndPointsConfigurator from './endPointsConfigurator';
import Repository from './adapters/repository/repository';
import { version, name } from './package.json';
import { collectDefaultMetrics } from 'prom-client';
import TYPES from './container.types';
import { inject, injectable } from 'inversify';
import tracingMiddleware from "./tracingMiddleware";
import Projects from './domain/Projects';
import Cache from './adapters/cache';
import data from './config/config.json';
import express from 'express';

const PORT = process.env.API_PORT;

@injectable()
export class Api {
    public constructor(
        @inject(TYPES.Express) private createExpressServer: () => express.Application,
        @inject(TYPES.PromBundle) private promBundle: Function,
        @inject(TYPES.Repository) private dataBase: Repository,
        @inject(TYPES.EndPointsConfigurator) private endPointsConfigurator: EndPointsConfigurator,
        @inject(TYPES.Projects) private projects: Projects,
        @inject(TYPES.Cache) private cache: Cache
    ) { }

    init() {
        return new Promise<void>(async (resolve) => {
            const api = this.createExpressServer();

            api.use(httpContextMiddlware());
            this.collectMetricsFrom(api);
            api.use(tracingMiddleware());
            api.use(cors());
            this.endPointsConfigurator.configure(api);
            await this.installSwaggerOn(api);
            await this.dataBase.connect();
            // await this.cache.flushAll();
            await this.loadOrganizationsInCache();
            this.runPeriodicUpdateTask();
            api.listen(PORT, () => {
                console.log(`web api listening on port ${PORT}`);
                resolve();
            });
        })
    }

    async loadOrganizationsInCache() {
        for (let org of data.dataToCache) {
            console.log(`Pre-loading projects-${org.organization}-${org.branch}`);
            await this.cache.getOrSet(`projects-${org.organization}-${org.branch}`, () => this.projects.getAll(org.organization, org.branch, '9999', 9999));
        }
        console.log(`All projects pre-loaded in cache`);
    }

    runPeriodicUpdateTask() {
        if (data.scheduleInfo.enable) {
            data.scheduleInfo.timer['dayOfWeek'] = new schedule.Range(0, 6);
            schedule.scheduleJob(data.scheduleInfo.timer, async () => {
                console.log("Refreshing projects...");
                for (let org of data.dataToCache) {
                    console.log(`Loading projects-${org.organization}-${org.branch}`);
                    const projects = await this.projects.getAll(org.organization, org.branch, '9999', 9999);
                    await this.cache.set(`projects-${org.organization}-${org.branch}`, projects);
                }
                console.log(`All projects refreshed`);
            });
        }
    }

    private collectMetricsFrom(api: express.Application) {
        collectDefaultMetrics();
        const prometheusCollector = this.promBundle({ includePath: true });
        api.use(prometheusCollector);
    }

    private async installSwaggerOn(api: express.Application) {
        const swaggerFilePath = './swagger.json';
        const options = {
            version,
            info: { title: name, description: 'Documentation of dashboard web api' },
            host: `${process.env.API_HOST}:${PORT}`
        };
        await SwaggerAutogen()(swaggerFilePath, ['./endPointsConfigurator.ts'], options);
        const swagger = await import(swaggerFilePath);
        api.use('/api', swaggerUi.serve, swaggerUi.setup(swagger));
    }
}
