import React from 'react';
import { Tile } from '../../../_shared/Tile';
import { Typography } from '@material-ui/core';
import { TILE_THEMES } from '../../../_shared/config';

export default function BuildTimeAverageTile({ executions, xs=12, sm, md, lg }) {
    const build_duration_average = getDurationAverageFrom(executions) || 0;

    return <Tile theme={build_duration_average > 14 || build_duration_average === 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} text="Build time average" xs={xs} sm={sm} md={md} lg={lg} >
        <Typography align="center" variant="h5"><b>{build_duration_average}</b> min</Typography>
    </Tile>;
}

function getDurationAverageFrom(executions) {
    let totalDurations = 0;
    const finalizedExecutions = executions.filter(e => e.finished_at && e.status === 'success');
    finalizedExecutions.forEach(e => {
        totalDurations += e.duration_in_minutes;
    });
    const build_duration_average = totalDurations / finalizedExecutions.length;
    return Math.round(build_duration_average * 10) / 10;
}