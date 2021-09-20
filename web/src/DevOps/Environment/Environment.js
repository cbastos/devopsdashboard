import React, { Fragment, useEffect, useState } from 'react';
import 'swagger-ui/dist/swagger-ui.css';
import { fetchApiJson } from '../../_shared/fetchJson';
import { Tile } from '../../_shared/Tile';
import TileGroup from '../../_shared/TileGroup';
import { TILE_THEMES } from '../../_shared/config';
import { Typography } from '@material-ui/core';
import { FullOption } from '../../_shared/FullOption';
import MonthlyDeployments from './MonthlyDeployments';
import SwaggerUI from './SwaggerUI';

function useDeploymentsOf(projectId) {
    const [deployments, setDeployments] = useState();
    useEffect(() => {
        if (projectId) {
            fetchApiJson(`/projects/${projectId}/deployments`).then((newDeployments) => {
                setDeployments(newDeployments);
            });
        }
    }, [projectId]);
    return [deployments];
}

export default function ({ projectId, gitlabProjectId, branch, type }) {
    const [deployments] = useDeploymentsOf(projectId);
    
    const numberOfDeployments = deployments?.statistics.deployments.value + deployments?.statistics.rollbacks.value + deployments?.statistics.undeployments.value;
    const timeAverageInSeconds = Math.round(deployments?.statistics.deployments.timeAverageInSeconds);
    const succesfullDeploymentsPercentage = Math.round(deployments?.statistics.deployments.done.percentage);
    const cancelledDeploymentsPercentage = Math.round(deployments?.statistics.deployments.cancelled.percentage);
    const rollbacksPercentage = Math.round(deployments?.statistics.rollbacks.percentage);
    const undeploymentsPercentage = Math.round(deployments?.statistics.undeployments.percentage);

    return <Fragment>
        {deployments ? <> <TileGroup spacing={1}>
            <Tile text='Deployments' theme={TILE_THEMES.NEUTRAL} title={'Deployments'} xs={12} sm={2}>
                <Typography align="center" variant="h4"><b>{numberOfDeployments}</b></Typography>
            </Tile>
            <Tile text='Rollbacks' theme={TILE_THEMES.ERROR_LOW} title={'Deployments'} xs={12} sm={2}>
                <Typography align="center" variant="h4"><b>{deployments?.statistics.rollbacks.value}</b></Typography>
            </Tile>
            <Tile text='Time average' theme={TILE_THEMES.SUCCESS_LOW} title={'Deployments'} xs={12} sm={2}>
                <Typography align="center" variant="h4"><b>{timeAverageInSeconds}</b>sec</Typography>
            </Tile>´
            <Tile theme={TILE_THEMES.NEUTRAL} text="Deployments Statistics" xs={12} sm={6} md={4}>
                <FullOption
                    data={[
                        { title: 'Success', value: succesfullDeploymentsPercentage, color: 'white', backgroundColor: 'green' },
                        { title: 'Cancelled', value: cancelledDeploymentsPercentage, color: 'white', backgroundColor: 'yellow' },
                        { title: 'Rollbacks', value: rollbacksPercentage, color: 'white', backgroundColor: 'red' },
                        { title: 'Undeployments', value: undeploymentsPercentage, color: 'white', backgroundColor: 'brown' }
                    ]}
                />
            </Tile>
        </TileGroup>
        { <MonthlyDeployments deployments={deployments} />}
        </> : 'Loading...'
        }
        <SwaggerUI projectId={gitlabProjectId} branch={branch} type={type} />
    </Fragment >
}
