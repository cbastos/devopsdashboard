import Repository from '../adapters/repository/repository';
import TYPES from '../container.types';
import { inject, injectable } from 'inversify';
import CodeQualityAgent from './ports/codeQualityAgent';
import CommitsRetriever from './ports/commitsRetriever';
import PipelinesRetriever from './ports/pipelinesRetriever';
import data from '../config/config.json';
import { Execution } from './ports/types/data-structure-types';
import { Project } from './ports/types/jira-data-structures';
import { Component, Measure } from './ports/types/sonar-data-structures';
import { Commit } from './ports/types/gitlab-data-structures';

@injectable()
export default class Projects {
    @inject(TYPES.Repository) private repository: Repository;
    @inject(TYPES.CommitsRetriever) private commitsRetriever: CommitsRetriever;
    @inject(TYPES.PipelinesRetriever) private pipelinesRetriever: PipelinesRetriever;
    @inject(TYPES.CodeQualityAgent) private codeQualityAgent: CodeQualityAgent;
    projectsWithoutExecutions: number[] = [];

    async getAll(organizationId: number, branch: string, limit: string, selectedProductIdFilter: number) {
        this.projectsWithoutExecutions = [];
        let projectsTmp = (await this.repository.getProjects(organizationId, limit, selectedProductIdFilter)).filter(p => [1, 2, 3, 5].includes(p.projecttypeid));
        let projectsSplited = [];
        let projects = [];
        let i: number, j: number;
        const chunk = data.chunk;

        for (i = 0, j = projectsTmp.length; i < j; i += chunk) {
            console.log(`Loading ${i + chunk < projectsTmp.length ? i + chunk : projectsTmp.length} of ${projectsTmp.length} projects...`)
            projectsSplited.push(await this.getProjects({ projects: projectsTmp.slice(i, i + chunk) }, branch));
        }
        for (let projectSplit of projectsSplited) {
            for (let project of projectSplit) {
                projects.push(project);
            }
        }
        console.log("Projects without executions: ", this.projectsWithoutExecutions.length);
        if(this.projectsWithoutExecutions.length > 0) console.log(this.projectsWithoutExecutions);

        return projects;
    }

    async getProjects(projects: {projects: Project[]}, branch: string): Promise<Project[]> {
        return new Promise(resolve => {
            Promise.all(
                [
                    this.getSonarQubeMetricsOf(projects.projects),
                    this.getProjectPipelinesAndCommitsOf(projects.projects, branch),
                    this.getMergeRequestsProjects(projects.projects, branch)
                ]
            ).then(([projectsSonarStatuses, allProjectsInfo, mergesInfo]: any) => {
                this.getExecutionsInfoOfPipeline(allProjectsInfo).then((projectsExecutions: any) => {
                    resolve(projectsExecutions.map((pe: any) => {
                        const sonarqubeInfo = projectsSonarStatuses.find((p: { projectId: number; status: Measure }) => p.projectId === pe.project.coderepositoryid);
                        pe.project.sonarqubeStatus = sonarqubeInfo ? sonarqubeInfo.status : null;
                        pe.project.sonarqubeMeasures = sonarqubeInfo.measures || null;
                        pe.coderepositoryid = pe.project.coderepositoryid;
                        const merges = mergesInfo.find((p: { projectId: number }) => p.projectId === pe.project.coderepositoryid);
                        pe.project.merges = merges;
                        return pe;
                    }));
                });
            });
        });
    }

    private getSonarQubeMetricsOf(projects: Project[]) {
        const projectsWithSonarQubeInfo = projects.filter(p => p.codeanalyzerprojectid);
        return Promise.all(projectsWithSonarQubeInfo.map((project) =>
            this.codeQualityAgent.getMetricsOf(project.codeanalyzerprojectid).then((metrics: {component: Component}) => {
                const status = metrics && metrics.component ? metrics.component.measures.find(m => m.metric === 'alert_status') : '';
                const measures = metrics && metrics.component ? metrics.component.measures : [];
                return { projectId: project.coderepositoryid, status, measures };
            })
        ));
    }

    private getProjectPipelinesAndCommitsOf(projects: Project[], branch: string) {
        return Promise.all(projects.map((project) => {
            return this.pipelinesRetriever.getPipelines(project.coderepositoryid, branch).then((executions: Execution[]) => ({
                ...project, executions
            })).then((projectInfo: any) => {
                return this.commitsRetriever.getCommits(project.coderepositoryid, branch).then((commits: Commit[]) => {
                    return { ...projectInfo, commits };
                })
            });
        }))
    }

    private getExecutionsInfoOfPipeline(projects: Project[]) {
        return Promise.all(projects.map(({ id, coderepositoryid, executions = [], name: projectName, codeanalyzerprojectid, projecttypeid, config, documentationspacename, documentationpagename, repositorypackageid, jenkinsgroup, jenkinsprojectname, commits }) => {
            if(!executions.map) {
                this.projectsWithoutExecutions.push(coderepositoryid);
                return {
                    project: {
                        id,
                        coderepositoryid,
                        name: projectName,
                        codeanalyzerprojectid,
                        projecttypeid,
                        config,
                        confluence: { space: documentationspacename, page: documentationpagename },
                        repositorypackageid,
                        jenkins: { group: jenkinsgroup, name: jenkinsprojectname },
                        commits
                    },
                    executions: []
                };
            }
            else {
                return this.getProjectPipelinesTotalInfoOf(coderepositoryid, executions).then((executionsInfo) => {
                    return {
                        project: {
                            id,
                            coderepositoryid,
                            name: projectName,
                            codeanalyzerprojectid,
                            projecttypeid,
                            config,
                            confluence: { space: documentationspacename, page: documentationpagename },
                            repositorypackageid,
                            jenkins: { group: jenkinsgroup, name: jenkinsprojectname },
                            commits
                        },
                        executions: executionsInfo
                    };
                });
            }
        }))
    }

    private getProjectPipelinesTotalInfoOf(projectId: number, executions: Execution[]) {
        return Promise.all(executions.map(({ id: executionId }) => {
            return this.pipelinesRetriever.getPipeline(projectId, executionId)
                .then((e: Execution) => {
                    // const system_flow_time = (new Date(e.commit.created_at).getTime() - new Date(e.created_at).getTime()) / 1000 / 60;
                    const idle_job_average_in_seconds = this.getIdleJobTimeInSeconds(e.created_at, e.started_at);
                    return ({
                        created_at: e.created_at,
                        started_at: e.started_at,
                        finished_at: e.finished_at,
                        duration_in_minutes: (new Date(e.finished_at).getTime() - new Date(e.started_at || e.created_at).getTime()) / 1000 / 60,
                        idle_job_average_in_seconds,
                        // system_flow_time,
                        status: e.status
                    });
                })
                .catch((e: Error) => {
                    console.log(e.message);
                    return ({});
                });
        }))
    }

    private getIdleJobTimeInSeconds(creationDate: Date, startedDate: Date): number {
        if (creationDate && startedDate) {
            return (new Date(startedDate).getTime() - new Date(creationDate).getTime()) / 1000;
        }
        return 0;
    }

    private getMergeRequestsProjects(projects: Project[], branch: string) {
        return Promise.all(projects.map((project) =>
            this.getMergeRequests(project.coderepositoryid, branch).then((merges) => {
                return { projectId: project.coderepositoryid, merges };
            })
        ));
    }

    async getMergeRequests(projectId: number, branch: string) {        
        const merges = await this.commitsRetriever.getMergeRequests(projectId, branch);
        const mergesOpened = merges.filter((m: any) => m.state === 'opened');
        const mergesClosed = merges.filter((m: any) => m.state === 'closed');
        const mergesCompleted = merges.filter((m: any) => m.state === 'merged');
        const result = {opened:[] as any[], closed:[] as any[], merged:[] as any[]};
        mergesOpened.map((m: any) => result.opened.push({
            id: m.id,
            title: m.title,
            description: m.description,
            created_at: m.created_at,
            source_branch: m.source_branch,
            target_branch: m.target_branch,
            author: m.author
        }));
        mergesClosed.map((m: any) => result.closed.push({
            id: m.id,
            title: m.title,
            description: m.description,
            created_at: m.created_at,
            source_branch: m.source_branch,
            target_branch: m.target_branch,
            author: m.author,
            closed_by: m.closed_by,
            closed_at: m.closed_at
        }));
        mergesCompleted.map((m: any) => result.merged.push({
            id: m.id,
            title: m.title,
            description: m.description,
            created_at: m.created_at,
            source_branch: m.source_branch,
            target_branch: m.target_branch,
            author: m.author,
            merged_by: m.merged_by,
            merged_at: m.merged_at
        }));
        return  result;
    }
}
