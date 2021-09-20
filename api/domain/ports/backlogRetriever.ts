import { Backlog } from './types/data-structure-types';
import { IssueTypes, Project } from './types/jira-data-structures';

export default interface BacklogRetriever {
    getItemsOf(projectKey: string): Promise<Backlog>;
    getItem(key: string): Promise<Backlog>;
    getProjects(): Promise<Project[]>;
    getIssueTypes(): Promise<IssueTypes[]>;
    getCotributionsOf(username: string);
}
