import mysql from 'mysql';
import { Connection, ConnectionConfig } from 'mysql';
import path from 'path';
import fs from 'fs';
import { injectable } from 'inversify';
import * as opentracing from 'opentracing';
import { get } from '../../httpContext';
import "reflect-metadata";
const escape: (query: string, params: object) => string = require('mysql-named-params-escape');
import { QUERIES } from './queries';
import { Project } from '../../domain/ports/types/jira-data-structures';

// TODO: separate in multiple repositories
@injectable()
export default class Repository {
	private connection: Connection;
	readonly queries = QUERIES;

	async connect(): Promise<void> {
		this.connection = <Connection>await this.createConnection();
		await this.createTables();
		await this.loadSeedData();
	}

	private async createConnection(): Promise<Connection> {
		return new Promise((resolve, reject) => {
			const { DB_HOST, DB_PORT, DB_USER, DB_PWD, DB_NAME } = process.env;
			const dbConfig: ConnectionConfig = { host: DB_HOST, port: +DB_PORT, user: DB_USER, password: DB_PWD, database: DB_NAME, multipleStatements: true };
			const connection = mysql.createConnection(dbConfig);
			connection.connect((err: Error) => {
				if (err) {
					console.log('There was an error during DDBB connection');
					reject(err);
					return;
				}
				console.log('Database connected!');
				resolve(connection);
			});
		});
	}

	private async createTables() {
		return new Promise<void>((resolve, reject) => {
			const createTablesSeedQuery = fs.readFileSync(path.join(__dirname, './scripts/createTables.sql')).toString();

			this.connection.query(createTablesSeedQuery, (error: Error) => {
				if (error) {
					console.log('Error creating database structure:', error);
					reject(error);
				}
				console.log('Initial database structure created!');
				resolve();
			});
		});
	}

	private async loadSeedData() {
		return new Promise<void>((resolve, reject) => {
			const loadSeedQuery = fs.readFileSync(path.join(__dirname, './scripts/loadSeedEntitiesData.sql')).toString();
			console.log('Loading seed data...');
			this.connection.query(loadSeedQuery, (error: Error) => {
				if (error) {
					console.log('Error loading initial seed data.', error);
					reject();
				}
				console.log('Seed data loaded!');
				resolve();
			});
		});
	}

	async getEmployeesOf(organizationId: number) {
		const sql = escape(this.queries.GET_EMPLOYEES_OF, { organizationId });
		console.log('Getting employees from DB...');
		return await this.launchQuery(sql);
	}

	async getEmployeeUsername(employeeId: number): Promise<string> {
		const sql = escape('SELECT username FROM Employees WHERE id=:employeeId', { employeeId });
		const user = (await this.launchQuery(sql))[0];
		return user.username;
	}

	async getOrganizations() {
		return await this.launchQuery(this.queries.GET_ORGANIZATIONS);
	}

	async getOrganizationTeams(organizationId: number) {
		const teams = await this.launchQuery(escape(this.queries.GET_ORGANIZATION_TEAMS, { organizationId }));
		const teamsIds = teams.map(t => t.id);
		const teamsEmployees = await this.launchQuery(escape(this.queries.GET_EMPLOYEE_TEAMS, { teamsList: teamsIds }));
		const teamsWithEmployees = teams.map(t => ({ ...t, employees: teamsEmployees.filter(te => te.teamid === t.id) }));
		return teamsWithEmployees;
	}

	async getOrganizationProducts(organizationId: number) {
		return await this.launchQuery(escape('SELECT DISTINCT P.id, P.name, P.description FROM Products P , ProductsOrganizations PO WHERE P.id = PO.productid AND PO.organizationId = :organizationId ORDER BY P.id', { organizationId }));
	}

	async getProductsProjects(organizationId: number) {
		return await this.launchQuery(escape('SELECT * fROM ProductsProjects', { organizationId }));
	}

	async getJiraTribeProduct(organizationId: number, productId: number) {
		if([1,2].includes(productId)) {
			return await this.launchQuery(escape('SELECT * fROM WorkProjectOrganizationProduct WHERE productid=:productId', { productId }));
		}
		return await this.launchQuery(escape('SELECT * fROM WorkProjectOrganizationProduct WHERE organizationid=:organizationId', { organizationId }));
	}

	async getEmployeesTribeProduct(organizationId: number) {
		return await this.launchQuery(escape('SELECT * fROM EmployeesOrganizationProduct WHERE organizationid=:organizationId', { organizationId }));
	}

	async getEmployeeSkills(employeeId: number) {
		return await this.launchQuery(escape(this.queries.GET_EMPLOYEE_SKILLS, { employeeId }));
	}

	async getSkills() {
		return await this.launchQuery(this.queries.GET_SKILLS);
	}

	async getKnowledgeLevels() {
		return await this.launchQuery(`SELECT * FROM KnowledgeLevels`);
	}

	async getExperienceRanges() {
		return await this.launchQuery(`SELECT * FROM ExperienceRanges`);
	}

	async getProjects(organizationId: number, limit?: string, selectedProductIdFilter?: number): Promise<Project[]> {
		if(limit === 'undefined' || +limit === 9999) {
			return await this.launchQuery(escape(this.queries.GET_ORGANIZATION_PROJECTS, { organizationId }));
		} else {
			let limitmin = +limit + 0;
			let limitmax = 10;
			if(!selectedProductIdFilter) {
				return await this.launchQuery(escape(this.queries.GET_ORGANIZATION_PROJECTS_LIMIT, { organizationId, limitmin, limitmax }));
			} else {
				return await this.launchQuery(escape(this.queries.GET_ORGANIZATION_PROJECTS_LIMIT_PROD, { organizationId, limitmin, limitmax, selectedProductIdFilter }));
			}
			
		}

	}

	async getProjectTypes() {
		return await this.launchQuery(this.queries.GET_PROJECT_TYPES);
	}

	async getProjectDeployApplicationName(projectId: number): Promise<string> {
		const sql = escape('SELECT xldeployapplicationid FROM Projects WHERE id=:projectId', { projectId });
		const project = (await this.launchQuery(sql))[0];
		return project.xldeployapplicationid;
	}

	private launchQuery(query: string): Promise<Array<any>> {
		return new Promise((resolve, reject) => {
			const tracer = opentracing.globalTracer();
			const httpContextSpan: any = get('http_request_span');
			const span = tracer.startSpan('Repository', { childOf: httpContextSpan });
			span.log({ event: 'query_launch_start', query });
			this.connection.query(query, (err: Error, result: any[] | PromiseLike<any[]>) => {
				if (err) {
					span.log({ event: 'query_launch_error', error: err });
					reject(err);
					span.finish();
					return;
				}
				span.log({ event: 'query_launch_end', data: result });
				span.finish();
				resolve(result);
			});
		});
	}
}
