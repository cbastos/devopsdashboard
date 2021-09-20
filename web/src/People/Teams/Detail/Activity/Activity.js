import React, { useState, useEffect } from 'react';
import { Typography, Input, InputLabel, FormControl } from '@material-ui/core';
import { format, parse } from 'date-fns';
import compareDesc from 'date-fns/compareDesc';
import { fetchApiJson } from '../../../../_shared/fetchJson';
import { Tile } from '../../../../_shared/Tile';
import TileGroup from '../../../../_shared/TileGroup';
import { TILE_THEMES, GITLAB_URL, JIRA_URL } from '../../../../_shared/config';

function getSortedCommitsGroupedByDate(events) {
    const sortedEvents = events.sort((a, b) => compareDesc(new Date(a.created_at), new Date(b.created_at)));
    let groupsDictionary = sortedEvents.reduce((r, e) => {
        const key = format(new Date(e.created_at), 'dd/MMMM/yyyy');
        r[key] = [...r[key] || [], e];
        return r;
    }, {});
    return Object.keys(groupsDictionary).map(day => ({ day, events: groupsDictionary[day] }));
}

function useIssuesContributionOf(employeeId) {
    const [contributions, setContributions] = useState([]);
    useEffect(() => {
        if (employeeId) {
            fetchApiJson(`/employees/${employeeId}/contributions`).then((newContributions) => setContributions(newContributions));
        }
    }, [employeeId]);
    return [contributions];
}

function useProjectsEventsOf(employeeId, sinceDate) {
    const [projectsEvents, setProjectsEvents] = useState([]);
    useEffect(() => {
        if (employeeId && sinceDate) {
            const sinceDateString = format(sinceDate, 'yyyy-MM-dd');
            fetchApiJson(`/employees/${employeeId}/events?sinceDate=${sinceDateString}`)
                .then((newProjectsEvents) => {
                    setProjectsEvents(newProjectsEvents);
                });
        }
    }, [employeeId, sinceDate]);
    return [projectsEvents];
}

function useCommitsOf(userName, sinceDate) {
    const [commits, setCommits] = useState([]);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (userName && !loaded) {
            const sinceDateString = format(sinceDate, 'yyyy-MM-dd');
            fetchApiJson(`/commits?userName=${userName}&sinceDate=${sinceDateString}`).then((newCommits) => {
                setLoaded(true);
                setCommits(newCommits);
            });
        }
    }, [userName]);
    return [commits];
}

function getTypeOf(commit) {
    const commitTypes = ['merge', 'fix', 'feat'];
    for (let i = 0, l = commitTypes.length; i < l; ++i) {
        const commitType = commitTypes[i];
        if (commit.title.substring(0, commitType.length).toLocaleLowerCase() === commitType) {
            return commitType;
        }
    }
    return 'unknown';
}

export default function Activity({ developer, toggle }) {
    const [sinceDate, setSinceDate] = useState(new Date('2020-03-01'));
    const [projectsEvents] = useProjectsEventsOf(developer.id, sinceDate);
    const [commits] = useCommitsOf(developer.username, sinceDate);
    const [contributions] = useIssuesContributionOf(developer.id);
    const numberOfContributedBugs = contributions.filter(c => c.fields.issuetype.name === 'Bug').length;
    const numberOfContributedStories = contributions.filter(c => c.fields.issuetype.name === 'Story').length;
    let branches = [];
    commits.forEach(c => branches = [...branches, ...c.branches]);
    branches = Array.from(new Set(branches.map(b => b.id)));
    return <div>
        <FormControl>
            <InputLabel>Activity since</InputLabel>
            <Input type="date" defaultValue={format(sinceDate, 'yyyy-MM-dd')} onChange={({ target: { value } }) => setSinceDate(parse(value, 'yyyy-MM-dd', new Date()))} />
        </FormControl>
        <Typography variant="h5"> <a href={`${JIRA_URL}/issues/?jql=issuetype%20in%20(Error,%20Bug,%20Historia,%20Story)%20AND%20status%20in%20(Resolved,%20Closed,%20Cancelled,%20Done,%20Finalizado,%20Developed,%20Producci%C3%B3n)%20AND%20updated%20%3E=%202021-03-01%20AND%20updated%20%3C=%202021-03-31%20AND%20assignee%20in%20(${developer.username})`}>Work activity</a> </Typography>
        <TileGroup spacing={1}>
            <Tile theme={TILE_THEMES.NEUTRAL} text="Contributed Stories" xs={12} sm={6} md={3}>
                <Typography align="center" variant="h4"><b>{numberOfContributedStories}</b></Typography>
            </Tile>
            <Tile theme={TILE_THEMES.NEUTRAL} text="Contributed Bugs" xs={12} sm={6} md={3}>
                <Typography align="center" variant="h4"><b>{numberOfContributedBugs}</b></Typography>
            </Tile>
        </TileGroup>
        <Typography variant="h5"> <a href={`${GITLAB_URL}/${developer.username}`}>Code activity</a> </Typography>
        {

            branches.map(branch => {
                const results = getCommitsStatsOf(commits, branch);

                return <React.Fragment key={branch}>
                    <Typography variant="h6">{branch}</Typography>
                    <TileGroup spacing={1}>

                        <Tile theme={TILE_THEMES.NEUTRAL} text="Features commits stats" title={`${results.feat.additions} additions and ${results.feat.deletions} deletions`} xs={12} sm={6} md={3}>
                            <Typography align="center" variant="h4"><b>{results.feat.total}</b></Typography>
                        </Tile>
                        <Tile theme={TILE_THEMES.NEUTRAL} text="Fixes commits stats" title={`${results.fix.additions} additions and ${results.fix.deletions} deletions`} xs={12} sm={6} md={3}>
                            <Typography align="center" variant="h4"><b>{results.fix.total}</b></Typography>
                        </Tile>
                        <Tile theme={TILE_THEMES.NEUTRAL} text="Merges commits stats" title={`${results.merge.additions} additions and ${results.merge.deletions} deletions`} xs={12} sm={6} md={3}>
                            <Typography align="center" variant="h4"><b>{results.merge.total}</b></Typography>
                        </Tile>
                        <Tile theme={results.unknown.total > 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.NEUTRAL} text="Unknown commits stats" title={`${results.unknown.additions} additions and ${results.unknown.deletions} deletions`} xs={12} sm={6} md={3}>
                            <Typography align="center" variant="h4"><b>{results.unknown.total}</b></Typography>
                        </Tile>
                    </TileGroup>
                </React.Fragment>;
            })
        }
        <Typography variant="h6">
            {projectsEvents.length > 0 ? ` ${projectsEvents.length} repositories` : 'Does not have commits'}
        </Typography>
        <ul>
            {
                projectsEvents.map(p =>
                    <li key={`${developer.username}-${p.id}`} style={{ color: 'black' }}>
                        <strong>{p.name}</strong> (id: {p.id})
                        {<button onClick={() => toggle(p)}>{p.showMore ? '-' : '+'}</button>}
                        {p.showMore &&
                            <ul>
                                {p.events && getSortedCommitsGroupedByDate(p.events).map(({ day, events }) => {
                                    return <li key={`${developer.username}-${p.id}-day-${day}`}>
                                        <strong>{day}</strong>:
                                        <ul>
                                            {events.map((e, i) =>
                                                <li key={`${developer.username}-${p.id}-day-${e.day}-commit-${i}`}>
                                                    {e.push_data ?
                                                        `${JSON.stringify(e)} ${e.push_data.commit_count} commits ${e.action_name} ${e.push_data ? e.push_data.ref_type : ''}` : e.action_name}
                                                </li>
                                            )
                                            }
                                        </ul>
                                    </li>
                                })}
                            </ul>
                        }
                    </li>
                )
            }
        </ul>
    </div>;
}

function getCommitsStatsOf(commits = [], branch) {
    const results = {
        merge: { total: 0, additions: 0, deletions: 0 },
        fix: { total: 0, additions: 0, deletions: 0 },
        feat: { total: 0, additions: 0, deletions: 0 },
        unknown: { total: 0, additions: 0, deletions: 0 },
    };
    commits.forEach(commit => {
        commit.branches.filter(b => b.id === branch).forEach(({ commits: branchCommits }) => {
            branchCommits.forEach((c) => {
                const commitType = getTypeOf(c);
                results[commitType].total += c.stats.total;
                results[commitType].additions += c.stats.additions;
                results[commitType].deletions += c.stats.deletions;
            })
        });
    })
    return results;
}