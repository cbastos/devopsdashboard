
import React from 'react';
import ExternalLink from '../../_shared/ExternalLink';
import LastBuildTimeTile from './metrics/LastBuildTimeTile';
import BuildTimeAverageTile from './metrics/BuildTimeAverageTile';
import IdleJobTimeAverageTile from './metrics/IdleJobTimeAverageTile';
import FailureResolutionDaysAverageTile from './metrics/FailureResolutionDaysAverageTile';
import TotalExecutedBuildsTile from './metrics/TotalExecutedBuildsTile';
import BuildStatusPercentagesPieChart from './metrics/BuildStatusPercentagesPieChart';
import SystemTimeAverage from './metrics/SystemTimeAverage';
import TileGroup from '../../_shared/TileGroup';
import { Grid, Typography } from '@material-ui/core';

export function Jenkins({ projectId, commits, project, executions, url }) {
    if(executions[0]){
        return <div>
            <ExternalLink href={url}><b>Open Jenkins Dashboard ››</b></ExternalLink><br/><br/>
            <TileGroup spacing={1}>
                <Grid container item xs={12} sm={8} spacing={1}>
                    <LastBuildTimeTile project={project} executions={executions} url={url} sm={4} />
                    <TotalExecutedBuildsTile executions={executions} sm={4} />
                    <BuildTimeAverageTile executions={executions} sm={4} />
                    <IdleJobTimeAverageTile executions={executions} sm={4} />
                    <FailureResolutionDaysAverageTile executions={executions} sm={4} />
                    <SystemTimeAverage projectId={projectId} commits={commits} sm={4} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <BuildStatusPercentagesPieChart executions={executions} />
                </Grid>
            </TileGroup>
        </div>
    } else return <div>
        <ExternalLink href={url}><b>Open Jenkins Dashboard ››</b></ExternalLink><br/>
        <Typography align="left" variant="h6">No executions found!</Typography>
    </div>;
}
