import { Branch } from "./types/gitlab-data-structures";
import { Project } from "./types/jira-data-structures";

export default interface ProjectsRetriever {
    getProjects(projectsIds: Array<number>): Promise<Project[]>;
    getBranchesOf(projectId: number): Promise<Branch[]>;
}
