import React from 'react';
import { Typography } from '@material-ui/core';
import { Tile } from '../../../_shared/Tile';
import { TILE_THEMES } from '../../../_shared/config';
import SendSlackMessage from '../SendSlackMessage';
import ExternalLinkIcon from '../../../_shared/ExternalLinkIcon';

export default function LastBuildTimeTile({ project, executions, url, xs=12, sm, md, lg }) {
    const lastBuildExecution = executions[0];
    const { status, duration_in_minutes } = lastBuildExecution;
    const lastBuildUrl = `${url}/lastBuild`;
    return <Tile theme={status === 'failed' ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} text="Last build time" xs={xs} sm={sm} md={md} lg={lg} >
        <Typography align="center" variant="h5">
            <b>{Math.round(duration_in_minutes)}</b> min
            <ExternalLinkIcon href={lastBuildUrl} src="/jenkins.png"></ExternalLinkIcon>
            <SendSlackMessage message={(userId) => `Hola <@${userId}>! :disappointed_relieved: La última build del repo ${project} ha fallado, ¿puedes mirarla por favor? <${lastBuildUrl}|puedes verla fallando *aquí*>`} />
        </Typography>
    </Tile>
}