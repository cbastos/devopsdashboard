import { injectable } from 'inversify';
import DeploymentsAgent from '../domain/ports/deploymentsAgent';
import tokens from './tokens';

//TODO: to refactor and remove technical debt
// TODO: extraer a logica en Domain
const TASK_STATUS = { DONE: 'DONE', CANCELLED: 'CANCELLED' };
const ARTIFACTORY_URL = '';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

@injectable()
export default class XLDeployAgent implements DeploymentsAgent {

    public async getStatisticsFrom(applicationId: string, begin: string, end: string) {
        const application = applicationId.split('/')[0];
        console.log('app:> ', application);
        const applicationTasks = await this.fetchPostJsonWithAuth(
            `${ARTIFACTORY_URL}/deployit/internal/reports/tasks?begin=${begin}&end=${end}&filterType=application&resultsPerPage=-1`,
            JSON.stringify([{ id: applicationId, type: 'udm.Application' }])
        );
        console.log('applicationTasks:> ', applicationTasks.length);

        const applicationsStatistics = {
            deployments: this.getStatistics(applicationTasks, ['Update', 'Initial']),
            rollbacks: this.getStatistics(applicationTasks, ['Rollback']),
            undeployments: this.getStatistics(applicationTasks, ['Undeployment']),
        };

        return {
            // applications: await this.getData('Applications'),
            // deployments: await this.fetchJsonWithAuth(`${ARTIFACTORY_URL}/deployit/tasks/v2/current/all?fetchMode=SUMMARY&resultsPerPage=-1`),
            tasks: applicationTasks,
            statistics: applicationsStatistics
        };
    }

    private async getData(key: string, level = 5) {
        const keyParts = key.split('/');
        const lastKey = keyParts[keyParts.length - 1];
        const result = { key: lastKey, path: key, children: <any[]>[] };
        if (level > 0) {
            const deployments = await this.fetchJsonWithAuth(`${ARTIFACTORY_URL}/deployit/repository/v3/query?page=0&resultsPerPage=-1&parent=${key}`);
            for (let i = 0, l = deployments.length; i < l; ++i) {
                result.children.push(await this.getData(deployments[i].ref, --level));
            }
        }
        return result;
    }

    private async fetchJsonWithAuth(url: RequestInfo) {
        return await fetch(url, { headers: { Accept: 'application/json', Authorization: `Basic ${tokens.JIRA_TOKEN}` } }).then(d => { console.log(d.ok, d.statusText); return d.json() })
    }

    private async fetchPostJsonWithAuth(url: RequestInfo, body: string) {
        return await fetch(url, {
            method: 'POST',
            body,
            headers: {
                Accept: 'application/json',
                'accept-type': 'application/json',
                'content-type': 'application/json;charset=UTF-8',
                Authorization: `Basic ${tokens.JIRA_TOKEN}`
            }
        }).then(d => d.json());
    }

    private getStatistics(tasks: any, types: string[]) {
        const typesTasks = tasks.filter((t: { type: string; }) => types.includes(t.type));
        const doneTasks = typesTasks.filter((t: { status: string; }) => t.status === TASK_STATUS.DONE);

        let doneTaskTimesInSecondsSum = 0;
        doneTasks.forEach((t: { completionDate: Date; startDate: Date; }) => doneTaskTimesInSecondsSum += (new Date(t.completionDate).getTime() - new Date(t.startDate).getTime()) / 1000);
        const doneTaskTimeAverageInSeconds = doneTaskTimesInSecondsSum / doneTasks.length;
        const groupedPeriods: any = {};

        // TODO: añadir todo filtrado por entorno

        doneTasks.forEach((t: { completionDate: Date; environment: string; }) => {
            const completionDate = new Date(t.completionDate);
            const environment: string = t.environment.split('-')[1] || t.environment;
            const year = completionDate.getUTCFullYear();
            groupedPeriods[environment] = groupedPeriods[environment] || {};
            groupedPeriods[environment][year] = groupedPeriods[environment][year] || {};
            const monthName = MONTHS[completionDate.getUTCMonth()]
            groupedPeriods[environment][year][monthName] = groupedPeriods[environment][year][monthName] || [];
            groupedPeriods[environment][year][monthName].push(t);
        });
        const periods = Object.keys(groupedPeriods).map(environment => ({
            environment,
            years: Object.keys(groupedPeriods[environment]).map(year => ({
                year,
                months: Object.keys(groupedPeriods[environment][year]).map(month => ({
                    month,
                    deployments: groupedPeriods[environment][year][month]
                }))
            }))
        }));

        const cancelledTasks = typesTasks.filter((t: { status: string; }) => t.status === TASK_STATUS.CANCELLED);

        return {
            value: typesTasks.length,
            periods,
            timeAverageInSeconds: doneTaskTimeAverageInSeconds,
            percentage: typesTasks.length / tasks.length * 100,
            done: {
                value: doneTasks.length,
                percentage: doneTasks.length / tasks.length * 100
            },
            cancelled: {
                value: cancelledTasks.length,
                percentage: cancelledTasks.length / tasks.length * 100
            }
        };
    }
}
