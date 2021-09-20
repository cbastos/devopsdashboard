import React from 'react';
import { Tile } from '../../../_shared/Tile';
import { TILE_THEMES } from '../../../_shared/config';
import { Typography } from '@material-ui/core';

export default function TotalExecutedBuildsTile({ executions, xs=12, sm, md, lg }) {
    return <Tile theme={executions.length === 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.NEUTRAL} text='Total executed builds' xs={xs} sm={sm} md={md} lg={lg} >
        <Typography align="center" variant="h5"><b>{executions.length}</b> builds</Typography>
    </Tile>;
}
