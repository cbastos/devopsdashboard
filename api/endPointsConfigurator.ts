import Work from './domain/Work';
import Repository from './adapters/repository/repository';
import Projects from './domain/Projects';
import Employees from './domain/Employees';
import { version } from './package.json';
import { injectable, inject } from "inversify";
import TYPES from './container.types';
import CommitsRetriever from './domain/ports/commitsRetriever';
import Cache from './adapters/cache';
import BacklogRetriever from './domain/ports/backlogRetriever';
import { getKeycloak } from './auth';
import DeploymentsAgent from './domain/ports/deploymentsAgent';
import express from 'express';

const healthCheckRedis = require('health-check-redis');

@injectable()
export default class EndPointsConfigurator {

    @inject(TYPES.Cache) private cache: Cache;
    @inject(TYPES.Repository) private repository: Repository;
    @inject(TYPES.Employees) private employees: Employees;
    @inject(TYPES.Projects) private projects: Projects;
    @inject(TYPES.CommitsRetriever) private commitsRetriever: CommitsRetriever;
    @inject(TYPES.BacklogRetriever) private backlogRetriever: BacklogRetriever;
    @inject(TYPES.DeploymentsAgent) private deploymentsAgent: DeploymentsAgent;
    @inject(TYPES.Work) private work: Work;

    configure(api: express.Application): void {
        const cache = this.cache;
        const keycloak = getKeycloak(api);

        api.get('/api/version', (req, res) => {
            // #swagger.description = 'Retrieves the version of the api'
            res.json({ version });
        });

        api.get('/api/jira/projects/:projectId', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves jira information for some project'
            const { projectId } = req.params;
            const { issueTypes } = <{ issueTypes: string }>req.query;
            res.json(await this.work.getMetrics(projectId, issueTypes.split(',')));
        });

        api.get('/api/jira/projects', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            res.json(await this.backlogRetriever.getProjects());
        });

        api.get('/api/jira/issues/types', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            res.json(await this.backlogRetriever.getIssueTypes());
        });

        api.get('/api/employees', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves the employees filtered by an organization'
            /* #swagger.parameters['organizationId'] = { description: 'Organization identifier', type: 'integer' } */

            const { organizationId } = <{ organizationId: string }>req.query;
            const employeesWithActivity = await this.employees.getAllWithActivityBy(parseInt(organizationId));
            res.json(employeesWithActivity);
        });

        api.get('/api/employees/:id/skills', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves the skills levels of knowledge and experience of certain employee'
            res.json(await this.repository.getEmployeeSkills(+req.params.id));
        });

        api.get('/api/employees/:id/events', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves the skills levels of knowledge and experience of certain employee'
            /* #swagger.parameters['sinceDate'] = { description: 'Since date filter', type: 'Date' } */

            const { id: employeeId } = <{ id: string }>req.params;
            const { sinceDate } = <{ sinceDate: string }>req.query;
            res.json(await this.employees.getProjectsActivityOf(parseInt(employeeId), sinceDate));
        });

        api.get('/api/skills', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves skill list of knoledge tree'
            res.json({
                topics: await this.repository.getSkills(),
                knowledgeLevels: await this.repository.getKnowledgeLevels(),
                experienceRanges: await this.repository.getExperienceRanges()
            });
        });

        api.get('/api/organizations', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves company organizations (tribes, departments and, in general, groups of teams)'
            res.json(await this.repository.getOrganizations());
        });

        api.get('/api/organizations/:id/teams', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves the teams of certain organization'
            res.json(await this.repository.getOrganizationTeams(+req.params.id));
        });

        api.get('/api/productsprojects', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves the teams of certain organization'
            res.json(await this.repository.getProductsProjects(+req.params.id));
        });

        api.get('/api/jiratribeproducts', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            res.json(await this.repository.getJiraTribeProduct(+req.query.organizationId, +req.query.productId));
        });

        api.get('/api/employeestribes', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            res.json(await this.repository.getEmployeesTribeProduct(+req.query.tribe));
        });

        api.get('/api/organizations/:id/products', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves the teams of certain organization'
            res.json(await this.repository.getOrganizationProducts(+req.params.id));
        });

        api.get('/api/projects/types', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves types of software projects we have'
            res.json(await this.repository.getProjectTypes());
        });

        api.get('/api/projects', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves the software projects filtered by branch'
            /* #swagger.parameters['organizationId'] = { description: 'Organization identifier', type: 'integer' } */
            /* #swagger.parameters['branch'] = { description: 'Git branch filter to obtain gitlab projects activity', type: 'string' } */
            const { branch, organizationId, limit, selectedProductIdFilter } = req.query;
            const projects = await cache.getOrSet(
                `projects-${organizationId}-${branch}-${limit}-${selectedProductIdFilter}`, 
                () => this.projects.getAll(+organizationId, branch.toString(), limit.toString(), +selectedProductIdFilter)
            );
            res.json(projects);
        });

        api.get('/api/commits', async (req, res) => {
            // #swagger.description = 'Retrieves projects commits'
            // #swagger.parameters['userName'] = { description: 'User name', type: 'string' }
            // #swagger.parameters['sinceDate'] = { description: 'Since', type: 'string' }
            const { userName, sinceDate } = <{ userName: string, sinceDate: string }>req.query;
            const activity = await this.employees.getActivityOf(userName, sinceDate);
            res.json(activity);
        });

        api.get('/api/projects/:projectId/commits/:commitId', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves a commit information'
            const { projectId, commitId } = req.params
            const commit = await this.commitsRetriever.getCommit(+projectId, commitId);
            res.json(commit);
        });

        api.get('/api/projects/:id/deployments', keycloak.protect("DashboardsAdmin"), async (req, res) => {
            // #swagger.description = 'Retrieves information about deployments for all environments'
            const begin = '2018-02-14T00%3A00%3A00.000%2B0000';
            const end = '2021-02-24T23%3A59%3A59.999%2B0000';
            const { id: projectId } = req.params;
            const deploymentApplicationName = await this.repository.getProjectDeployApplicationName(parseInt(projectId));
            if(!deploymentApplicationName){
                console.log('not found !!!!!!', deploymentApplicationName, 'PROJECT ID ', projectId)
            }
            const deployments = await this.deploymentsAgent.getStatisticsFrom(deploymentApplicationName, begin, end);
            res.json(deployments);
        });

        api.get('/api/employees/:id/contributions', async (req, res) => {
            // #swagger.description = 'Retrieves information about work issues in backlog for certain user'
            // #swagger.parameters['userName'] = { description: 'User name', type: 'string' } 
            const { id: employeeId } = <{ id: string }>req.params;
            const userName = await this.repository.getEmployeeUsername(parseInt(employeeId));
            const { issues } = await this.backlogRetriever.getCotributionsOf(userName);
            res.json(issues);
        });

        api.get('/api/stats', async (req, res) => {
            // #swagger.description = 'Retrieves information about health of dashboard services'
            // console.log(await healthCheck(api));
            let activeServices = {
                "nodejs": true,
                "redis": false,
                "mysql": false
            };
            healthCheckRedis.do([
            {
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT
            }])
             .then(async (result: any) => {
                activeServices.redis = result.health || false;
                const testSqlCall = await this.repository.getOrganizations();
                activeServices.mysql = (testSqlCall.length && testSqlCall.length > 0) || false;

                res.json(activeServices);
             })
             .catch((error: any) => {
                console.log(`Error getting health check of redis service: ${error}`); 
             });
        });
    }
}

