import { inject, injectable } from 'inversify';
import Repository from '../adapters/repository/repository';
import TYPES from '../container.types';
import CommitsRetriever from './ports/commitsRetriever';
import EmployeeEventsRetriever from './ports/employeeEventsRetriever';
import ProjectsRetriever from './ports/projectsRetriever';
import { Event } from './ports/types/data-structure-types';
import { Project } from './ports/types/jira-data-structures';

@injectable()
export default class Employees {

    @inject(TYPES.Repository) private repository: Repository;
    @inject(TYPES.EmployeeEventsRetriever) private employeeEventsRetriever: EmployeeEventsRetriever;
    @inject(TYPES.ProjectsRetriever) private projectsRetriever: ProjectsRetriever;
    @inject(TYPES.CommitsRetriever) private commitsRetriever: CommitsRetriever;

    async getAllWithActivityBy(organizationId: number) {
        const employees = await this.repository.getEmployeesOf(organizationId);
        for (let i = 0, l = employees.length; i < l; ++i) {
            employees[i].skills = await this.repository.getEmployeeSkills(employees[i].id);
        }
        return employees;
    }

    async getProjectsActivityOf(employeeId: number, afterDateString: string) {
        const username = await this.repository.getEmployeeUsername(employeeId);
        return this.employeeEventsRetriever.getEventsOf(username, afterDateString).then((events: Event[]) => {
            const projectsIds: Array<number> = Array.from(new Set(events && events.map ? events.map(e => e.project_id) : null));
            return this.projectsRetriever.getProjects(projectsIds).then((developerProjects: Project[]) => {
                return Array.from(new Set(projectsIds.map(project_id => {
                    const project = developerProjects.find(p => p.id === project_id);
                    return {
                        id: project_id,
                        name: project.name,
                        events: events.filter(e => e.project_id === project_id)
                    };
                })));
            });
        });
    }

    async getActivityOf(userName: string, sinceDate: string) {
        const userEvents = await this.employeeEventsRetriever.getEventsOf(userName, sinceDate);
        const userPushDataEvents = userEvents.filter((ue: any) => ue.push_data);
        const eventsProjectsIds = Array.from<number>(new Set(userPushDataEvents.map((e: any) => e.project_id)));
        const projects = [];
        for (let i = 0, l = eventsProjectsIds.length; i < l; ++i) {
            const projectId = eventsProjectsIds[i];
            const projectBranches = userPushDataEvents.filter((u: any) => u.project_id === projectId).map((u: any) => u.push_data.ref);
            const branches = [];
            for (let k = 0, m = projectBranches.length; k < m; ++k) {
                const branchCommits = await this.commitsRetriever.getCommits(projectId, projectBranches[k]);
                const userCommits = branchCommits.filter((p: any) => p.author_name === userName);
                branches.push({
                    id: projectBranches[k],
                    commits: userCommits
                });
            }
            projects.push({ id: projectId, branches });
        }
        return projects;
    }
}
