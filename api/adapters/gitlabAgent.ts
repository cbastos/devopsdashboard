import { inject, injectable } from 'inversify';
import CommitsRetriever from '../domain/ports/commitsRetriever';
import TYPES from '../container.types';
import HttpClient from './httpClient';
import PipelinesRetriever from '../domain/ports/pipelinesRetriever';
import ProjectsRetriever from '../domain/ports/projectsRetriever';
import EmployeeEventsRetriever from '../domain/ports/employeeEventsRetriever';
import { Project } from '../domain/ports/types/jira-data-structures';
import { Branch, Commit, Pipeline } from '../domain/ports/types/gitlab-data-structures';

// TODO: share with web by enviroment variables in docker compose
export const GITLAB_URL = '';
export const GITLAB_API_URL = `${GITLAB_URL}/api/v4`;
export const GITLAB_TOKEN = '';

@injectable()
export default class GitlabAgent implements CommitsRetriever, PipelinesRetriever, ProjectsRetriever, EmployeeEventsRetriever {

    @inject(TYPES.HttpClient) private httpClient: HttpClient;

    getEventsOf(username: string, afterDateString: string) { // TODO: convert date to Date and format
        return this.getJson(`${GITLAB_API_URL}/users/${username}/events?per_page=20&after=${afterDateString}`, GITLAB_TOKEN);
    }

    getProjects(projectsIds: Array<number>): Promise<Project[]> {
        return Promise.all(projectsIds.map((id) => {
            return this.getJson(`${GITLAB_API_URL}/projects/${id}`, GITLAB_TOKEN)
        }));
    }

    getPipelines(projectId: number, branch: string): Promise<Pipeline[]> {
        return this.getJson(`${GITLAB_API_URL}/projects/${projectId}/pipelines?ref=${branch}&page=1&per_page=20`, GITLAB_TOKEN);
    }

    getPipeline(projectId: number, executionId: number): Promise<Pipeline> {
        return this.getJson(`${GITLAB_API_URL}/projects/${projectId}/pipelines/${executionId}`, GITLAB_TOKEN);
    }

    getCommits(projectId: number, branch: string) {
        return this.getJson(`${GITLAB_API_URL}/projects/${projectId}/repository/commits?ref_name=${branch}&with_stats=true&page=1&per_page=20`, GITLAB_TOKEN);
    }

    getCommit(projectId: number, commitId: string): Promise<Commit> {
        return this.getJson(`${GITLAB_API_URL}/projects/${projectId}/repository/commits/${commitId}`, GITLAB_TOKEN).then((fullInfoCommmit) => {
            if (fullInfoCommmit.last_pipeline && fullInfoCommmit.last_pipeline.status === 'success') {
                const system_time_in_minutes = (new Date(fullInfoCommmit.last_pipeline.updated_at).getTime() - new Date(fullInfoCommmit.created_at).getTime()) / 1000 / 60;
                fullInfoCommmit.system_time_in_minutes = system_time_in_minutes;
            }
            return fullInfoCommmit;
        });
    }

    getBranchesOf(projectId: number): Promise<Branch[]> {
        return this.getJson(`${GITLAB_API_URL}/projects/${projectId}/repository/branches`, GITLAB_TOKEN);
    }

    getMergeRequests(projectId: number, branch: string): Promise<[]> {
        return this.getJson(`${GITLAB_API_URL}/projects/${projectId}/merge_requests?state=all&target_branch=${branch}`, GITLAB_TOKEN);
    }

    private getJson(url: string, token: string) {
        const authorizedGet = { method: 'GET', headers: { 'PRIVATE-TOKEN': token } };
        return this.httpClient.getJson<any>(url, authorizedGet);
    }
}
