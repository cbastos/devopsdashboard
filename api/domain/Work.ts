import { inject, injectable } from 'inversify';
import TYPES from '../container.types';
import BacklogRetriever from './ports/backlogRetriever';
import { History } from './ports/types/data-structure-types';
import { Issue } from './ports/types/jira-data-structures';

@injectable()
export default class Work {

    @inject(TYPES.BacklogRetriever) private backlogRetriever: BacklogRetriever;

    getMetrics(projectKey: string, issueTypes: string[]) {
        return this.backlogRetriever.getItemsOf(projectKey).then(async data => {
            const { issues } = data;
            const all_project_issues = issues.map(issue => {
                let deviation: any = { seconds: 0 };
                if (issue.fields.timetracking && issue.fields.timetracking.originalEstimateSeconds && issue.fields.timetracking.timeSpentSeconds) {
                    deviation = {
                        estimatedTime: issue.fields.timetracking.originalEstimateSeconds,
                        spentTime: issue.fields.timetracking.timeSpentSeconds,
                        seconds: issue.fields.timetracking.originalEstimateSeconds - issue.fields.timetracking.timeSpentSeconds,
                        percentage: Math.round(100 - (issue.fields.timetracking.timeSpentSeconds / issue.fields.timetracking.originalEstimateSeconds * 100))
                    }
                }

                return ({
                    key: issue.key,
                    description: issue.fields.description,
                    summary: issue.fields.summary,
                    type: issue.fields.issuetype.name,
                    status: { final: issue.fields.status.name},
                    created: issue.fields.created,
                    deviation
                });
            });

            const result: any = {};
            for (let i = 0, l = issueTypes.length; i < l; ++i) {
                const issueType = issueTypes[i];
                result[issueType] = await this.get_work_changelog_for(all_project_issues, issueType);
            }
            return result;
        });
    }

    private async get_work_changelog_for(all_project_issues: Issue[], elementType: string) {
        const doneIssues = all_project_issues.filter(e => e.type === elementType && e.status.final === 'Done');
        const issuesChangelog = await Promise.all(doneIssues.map((e) => this.backlogRetriever.getItem(e.key).then(async (item) => {
            const histories = item.changelog.histories;
            let changelog: any[] = [];
            let assigneeChanges: any[] = [];
            histories.forEach((h: History) => {
                const statusChangesLogs = h.items.filter(i => i.field === 'status').map(status => {
                    return {
                        author: `${h.author.displayName} (${h.author.emailAddress})`,
                        from: status.fromString,
                        to: status.toString,
                        date: new Date(h.created)
                    };
                });
                changelog = [...changelog, ...statusChangesLogs];
            });
            histories.forEach((h: History) => {
                const asigneeChangesLogs = h.items.filter(i => i.field === 'assignee').map(asignee => {
                    return {
                        from: asignee.fromString,
                        to: asignee.toString,
                        date: new Date(h.created)
                    };
                });
                assigneeChanges = [...assigneeChanges, ...asigneeChangesLogs];
            });

            const pingpongAssignee = assigneeChanges.length;
            const createdDate = new Date(e.created);
            const startDevDate = changelog.find(c => c.to === 'In Progress');
            const endDevDate = changelog.find(c => c.to === 'Test');
            const endTestDate = changelog.find(c => c.to === 'Done');
            let devCycleTimeInWorkingDays: number;
            if (endDevDate && startDevDate) {
                devCycleTimeInWorkingDays = changelog.length === 0 ? null : (endDevDate.date.getTime() - startDevDate.date.getTime()) / (1000 * 3600 * 24);
            }
            let testingTimeInWorkingDays: number;
            if (endDevDate && endTestDate) {
                testingTimeInWorkingDays = changelog.length === 0 ? null : (endTestDate.date.getTime() - endDevDate.date.getTime()) / (1000 * 3600 * 24);
            }
            let todoTimeInWorkingDays: number;
            if (createdDate && startDevDate) {
                todoTimeInWorkingDays = changelog.length === 0 ? null : (startDevDate.date.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
            }
            let resolveTimeInWorkingDays: number;
            if (createdDate && endTestDate) {
                resolveTimeInWorkingDays = changelog.length === 0 ? null : (endTestDate.date.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
            }
            const cycleTime = changelog.length === 0 ? null : (changelog[changelog.length - 1].date.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
            
            return {
                key: e.key,
                type: e.type,
                created: createdDate,
                summary: e.summary,
                description: e.description,
                status: {
                    initial: 'To Do',
                    final: e.status.final,
                    changelog
                },
                cycleTime,
                devTime: devCycleTimeInWorkingDays,
                testTime: testingTimeInWorkingDays,
                todoTime: todoTimeInWorkingDays,
                resolveTime: resolveTimeInWorkingDays,
                deviation: e.deviation,
                pingpongAssignee: pingpongAssignee
            };
        })));

        const cycle_time_average = this.get_cycle_time_average_of(issuesChangelog);
        const dev_time_average = this.get_dev_time_average_of(issuesChangelog);
        const test_time_average = this.get_test_time_average_of(issuesChangelog);
        const blocked_time_average = this.get_blocked_time_average_of(issuesChangelog);
        const to_do_time_average = this.get_to_do_time_average_of(issuesChangelog);
        const resolve_time_average = this.get_resolve_time_average_of(issuesChangelog);
        const antiquity_average = this.get_age_days_average_of(issuesChangelog);
        const opened_count = this.get_opened_count_of(issuesChangelog);
        const last_week_count = this.get_last_week_count_of(issuesChangelog);
        const pingpong_assignee_average = this.get_pingpong_assignee_average_of(issuesChangelog);

        return {
            to_do_time_average,
            dev_time_average,
            blocked_time_average,
            test_time_average,
            cycle_time_average,
            items: issuesChangelog,
            opened_count,
            last_week_count,
            resolve_time_average,
            antiquity_average,
            pingpong_assignee_average
        };
    }

    private get_cycle_time_average_of(issues: Issue[]): number {
        let allcycleTime = 0;
        issues.forEach((b) => allcycleTime += b.cycleTime);
        const cycle_time_average = (allcycleTime / issues.length);
        return cycle_time_average;
    }

    private get_dev_time_average_of(issues: Issue[]): number {
        const valid_issues = issues.filter(e => e.devTime /*&& e.devTime >= 0.0208*/);
        let allDevTime = 0;
        valid_issues.forEach((b) => allDevTime += b.devTime || 0);
        return allDevTime / valid_issues.length;
    }

    private get_test_time_average_of(issues: Issue[]): number {
        const valid_issues = issues.filter(e => e.testTime);
        let allTestTime = 0;
        valid_issues.forEach((b) => allTestTime += b.testTime || 0);
        return allTestTime / valid_issues.length;
    }

    private get_to_do_time_average_of(issues: Issue[]): number {
        const valid_issues = issues.filter(e => e.todoTime);
        let allToDoTime = 0;
        valid_issues.forEach((b) => allToDoTime += b.todoTime || 0);
        return allToDoTime / valid_issues.length;
    }

    private get_blocked_time_average_of(issues: Issue[]): number {
        let allBlockedDays = 0;
        issues.forEach((b) => {
            for (let i = 0, l = b.status.changelog.length - 1; i < l; ++i) {
                const status_change = b.status.changelog[i];
                if (status_change.to === 'Blocked') {

                    const unblocked_date = status_change === b.status.changelog[l] ?
                        new Date() :
                        b.status.changelog[i + 1].date;

                    allBlockedDays += (unblocked_date.getTime() - status_change.date.getTime()) / (1000 * 3600 * 24);
                }
            }
        });
        return (allBlockedDays / issues.length) || 0;
    }

    private get_age_days_average_of(issues: Issue[]): number {
        const valid_issues = issues.filter(e => e.created && e.status.final != 'Done');
        let nowDate = new Date();
        let allAgeTime = 0;
        valid_issues.forEach((b) => {allAgeTime += ( (nowDate.getTime()-b.created.getTime()) / (1000*60*60*24) || 0) });
        if (valid_issues.length === 0) return 0;
        return allAgeTime / valid_issues.length;
    }
    
    private get_opened_count_of(issues: Issue[]): number {
        const valid_issues = issues.filter(e =>  e.status.final != 'Done');
        return valid_issues.length;
    }

    private get_last_week_count_of(issues: Issue[]): number {
        let nowDate = new Date();
        const valid_issues = issues.filter(e => e.created && ((nowDate.getTime()-e.created.getTime()) / (1000*60*60*24)) < 7);
        return valid_issues.length;
    }

    private get_resolve_time_average_of(issues: Issue[]): number {
        const valid_issues = issues.filter(e => e.resolveTime);
        let allResolveTime = 0;
        valid_issues.forEach((b) => { allResolveTime += b.resolveTime });
        if (valid_issues.length === 0) return 0;
        return allResolveTime / valid_issues.length;
    }

    private get_pingpong_assignee_average_of(issues: Issue[]): number {
        let allPingpong = 0;
        issues.forEach((b) => { allPingpong += b.pingpongAssignee });
        if (issues.length === 0) return 0;
        return allPingpong / issues.length;
    }

}