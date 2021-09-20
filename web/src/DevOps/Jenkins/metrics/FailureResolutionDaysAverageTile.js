import React from 'react';
import { Tile } from '../../../_shared/Tile';
import { Typography } from '@material-ui/core';
import { TILE_THEMES } from '../../../_shared/config';

export default function FailureResolutionDaysAverageTile({ executions, xs=12, sm, md, lg }) {
    const failure_resolution_hours_average = getFailureResolutionTimeAverage(executions);

    return <Tile theme={failure_resolution_hours_average > 1 || failure_resolution_hours_average === 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} text="Recovery time average" xs={xs} sm={sm} md={md} lg={lg} >
        <Typography align="center" variant="h5"><b>{failure_resolution_hours_average}</b> hours</Typography>
    </Tile>;
}

function getFailureResolutionTimeAverage(executions) {
    let resolutions = [];
    const executionsOrderByAscDate = [...executions].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    for (let i = 0, l = executionsOrderByAscDate.length - 1; i < l; ++i) {
        const execution = executionsOrderByAscDate[i];
        if (execution.status === 'failed') {
            for (let j = i, k = executionsOrderByAscDate.length; j < k; ++j) {
                const olderExecution = executionsOrderByAscDate[j];
                if (olderExecution.status === 'success') {
                    const hours = (new Date(olderExecution.finished_at) - new Date(execution.finished_at)) / 1000 / 60 / 60;
                    resolutions.push(hours);
                    break;
                }
            }
        }
    }
    let total = 0;
    resolutions.forEach(hours => total += hours);
    return resolutions.length > 0 ? (total / resolutions.length).toFixed(1) : 0;
}