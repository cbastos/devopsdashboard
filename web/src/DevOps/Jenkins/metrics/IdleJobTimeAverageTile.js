import React from 'react';
import { Tile } from '../../../_shared/Tile';
import { Typography } from '@material-ui/core';
import { TILE_THEMES } from '../../../_shared/config';

export default function IdleJobTimeAverageTile({ executions, xs=12, sm, md, lg }) {
    const idle_time_average = getIdleTimeAverageFrom(executions) || 0;
    return <Tile theme={idle_time_average > 5 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} text="Idle job average" xs={xs} sm={sm} md={md} lg={lg} >
        <Typography align="center" variant="h5"><b>{idle_time_average}</b> sec</Typography>
    </Tile>;
}

function getIdleTimeAverageFrom(executions) {
    let totalDurations = 0;
    executions.forEach(e => {
        totalDurations += e.idle_job_average_in_seconds;
    });
    return Math.round((totalDurations / executions.length) * 10) / 10;
}
