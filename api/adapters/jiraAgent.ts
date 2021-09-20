import HttpClient from './httpClient';
import Tokens from './tokens';
import { inject, injectable } from 'inversify';
import TYPES from '../container.types';
import BacklogRetriever from '../domain/ports/backlogRetriever';
import { Backlog } from '../domain/ports/types/data-structure-types';
import { IssueTypes, Project } from '../domain/ports/types/jira-data-structures';

const options = { headers: { Authorization: `Basic ${Tokens.JIRA_TOKEN}` } };
const JIRA_API_URL = ''; // TODO: extract to configuration variable

@injectable()
export default class JiraAgent implements BacklogRetriever {

    @inject(TYPES.HttpClient) private httpClient: HttpClient;

    getItemsOf(projectKey: string): Promise<Backlog> {
        const FIELDS = [
            'status', 'description', 'issuetype', 'summary', 'key', 'created', 'timetracking', 'timespent',
            'timeoriginalestimate', 'timeestimate', 'aggregatetimespent', 'aggregatetimeoriginalestimate',
            'aggregatetimeestimate', 'aggregateprogress'
        ];

        return this.httpClient.getJson(`${JIRA_API_URL}/search?jql=project=%22${projectKey}%22&maxResults=6000&fields=${FIELDS.join()}`, options);
    }

    getItem(issueKey: string): Promise<Backlog> {
        return this.httpClient.getJson(`${JIRA_API_URL}/issue/${issueKey}?expand=changelog`, options);
    }

    getProjects(): Promise<Project[]> {
        return this.httpClient.getJson(`${JIRA_API_URL}/project`, options);
    }

    getIssueTypes(): Promise<IssueTypes[]> {
        return this.httpClient.getJson(`${JIRA_API_URL}/issuetype`, options);
    }

    getCotributionsOf(username:string) {
        const getContributionsUrl = `/search?jql=issuetype%20in%20(Error,%20Bug,%20Historia,%20Story)%20AND%20status%20in%20(Resolved,%20Closed,%20Cancelled,%20Done,%20Finalizado,%20Developed,%20Producci%C3%B3n)%20AND%20updated%20%3E=%202021-03-01%20AND%20updated%20%3C=%202021-03-31%20AND%20assignee%20changed%20to%20${username}`
        return this.httpClient.getJson(`${JIRA_API_URL}/${getContributionsUrl}`, options);
    }
}