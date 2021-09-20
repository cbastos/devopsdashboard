import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { Tile } from '../../../_shared/Tile';
import { TILE_THEMES } from '../../../_shared/config';
import { fetchApiJson } from '../../../_shared/fetchJson';

export default function SystemTimeAverage({ projectId, commits, xs=12, sm, md, lg }) {
    const [total_system_time_average_in_minutes, set_total_system_time_average_in_minutes] = useState({ features: 0, fixes: 0 });
    useEffect(() => {
        get_total_system_time_average_in_minutes(projectId, commits)
            .then((average) => { set_total_system_time_average_in_minutes(average) });
    }, [projectId, commits]);
    return <React.Fragment>
        <Tile theme={TILE_THEMES.NEUTRAL} text='Feature system time average' xs={xs} sm={sm} md={md} lg={lg} >
            <Typography align="center" variant="h5"><b>{total_system_time_average_in_minutes.features}</b> min</Typography>
        </Tile>
        <Tile theme={TILE_THEMES.NEUTRAL} text='Fix system time average' xs={xs} sm={sm} md={md} lg={lg} >
            <Typography align="center" variant="h5"><b>{total_system_time_average_in_minutes.fixes}</b> min</Typography>
        </Tile>
    </React.Fragment>;
}

async function get_total_system_time_average_in_minutes(projectId, commits) {
    const fullInfoCommits = await Promise.all(commits.map(({ id }) => getCommitInfo(id, projectId)));
    const features_total_system_time_average_in_minutes = get_system_time_average_of_commits_starting_with('feat:', fullInfoCommits);
    const fixes_total_system_time_average_in_minutes = get_system_time_average_of_commits_starting_with('fix:', fullInfoCommits);
    return {
        features: features_total_system_time_average_in_minutes,
        fixes: fixes_total_system_time_average_in_minutes
    };
}

function get_system_time_average_of_commits_starting_with(title_prefix, fullInfoCommits) {
    let total_system_times_in_minutes = 0;
    const commitsWithSystemTime = fullInfoCommits.filter(c => c.system_time_in_minutes && c.title.startsWith(title_prefix));
    commitsWithSystemTime.forEach(c => {
        total_system_times_in_minutes += c.system_time_in_minutes;
    });
    if (total_system_times_in_minutes === 0)
        return 0
    else
        return Math.round(total_system_times_in_minutes / commitsWithSystemTime.length);
}

function getCommitInfo(commitId, projectId) {
    return fetchApiJson(`/projects/${projectId}/commits/${commitId}`).then((fullInfoCommmit) => {
        if (fullInfoCommmit.last_pipeline && fullInfoCommmit.last_pipeline.status === 'success') {
            const system_time_in_minutes = (new Date(fullInfoCommmit.last_pipeline.updated_at) - new Date(fullInfoCommmit.created_at)) / 1000 / 60;
            fullInfoCommmit.system_time_in_minutes = system_time_in_minutes;
        }
        return fullInfoCommmit;
    });
}
