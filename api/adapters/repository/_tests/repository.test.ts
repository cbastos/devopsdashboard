import Repository from '../repository';
import mysql from 'mysql';
import fs from 'fs';
import path from 'path';
const escape: (query: string, params: object) => string = require('mysql-named-params-escape');

describe('The repository connection and interaction', () => {
    jest.mock('mysql');
    let repository: Repository;
    let connectionCreateSpy: jasmine.Spy;
    let connectionSpy: jasmine.Spy;
    let querySpy: jasmine.Spy;
    
    let fakeConnection = { 
        connect: (callback: Function) => callback(),
        query: (query: string, callback: Function) => callback()
    };

    beforeAll(async () => {
        mysql.createConnection = jest.fn().mockImplementation(() => fakeConnection) as () => mysql.Connection;
        repository = new Repository();
        connectionCreateSpy = spyOn(mysql, 'createConnection').and.callThrough();
        connectionSpy = spyOn(fakeConnection, 'connect').and.callThrough();
        querySpy = spyOn(fakeConnection, 'query').and.callThrough();
        await repository.connect();
    });

    test('should create the connection ', () => {
        expect(connectionSpy).toHaveBeenCalled();
        expect(connectionCreateSpy).toHaveBeenCalled();
    });

    test('should create the tables', () => {
        const createTablesSeedQuery = fs.readFileSync(path.join(__dirname, '../scripts/createTables.sql')).toString();
        expect(querySpy).toHaveBeenCalledWith(createTablesSeedQuery, expect.anything());
    });

    test('should get the employees of a given organization', () => {
        repository.getEmployeesOf(1).then(() => expect(querySpy).toHaveBeenCalledWith(escape(repository.queries.GET_EMPLOYEES_OF, {organizationId: 1}), expect.anything()));
    });

    test('should get the organizations', () => {
        repository.getOrganizations().then(() => expect(querySpy).toHaveBeenCalledWith(repository.queries.GET_ORGANIZATIONS, expect.anything()));
    });
    
    test('should get the organization teams', () => {
        const teams = escape(repository.queries.GET_ORGANIZATION_TEAMS, {organizationId: 1});
        const teamsEmployees = escape(repository.queries.GET_EMPLOYEE_TEAMS, {teamsList : 1});
        
        repository.getOrganizationTeams(1).then(() => {
            expect(querySpy).toHaveBeenCalledWith(teams, expect.anything());
            expect(querySpy).toHaveBeenCalledWith(teamsEmployees, expect.anything());
        });

        /* TO-DO: Add logic for teams filtering */
    });

    test('should get employee skills', () => {
        const sql = 'SELECT * FROM EmployeeSkills WHERE employeeid=1';
        repository.getEmployeeSkills(1).then(() => expect(querySpy).toHaveBeenCalledWith(sql, expect.anything()));
    });

    test('should get the skills', () => {
        repository.getSkills().then(() => expect(querySpy).toHaveBeenCalledWith(repository.queries.GET_SKILLS, expect.anything()));
    });

    test('should get the projects for a given organization', () => {
        const sql = escape(repository.queries.GET_ORGANIZATION_PROJECTS, {organizationId: 1});
        repository.getProjects(1).then(() => expect(querySpy).toHaveBeenCalledWith(sql, expect.anything()));
    });

    test('should get the project types', () => {
        repository.getProjectTypes().then(() => expect(querySpy).toHaveBeenCalledWith(repository.queries.GET_PROJECT_TYPES, expect.anything()));
    });
});