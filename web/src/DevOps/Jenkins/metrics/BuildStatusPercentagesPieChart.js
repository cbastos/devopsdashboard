import React from 'react';
import { FullOption } from '../../../_shared/FullOption';
import { TILE_THEMES, TILE_THEMES_COLORS } from '../../../_shared/config';
import { Tile } from '../../../_shared/Tile';

export default function BuildStatusPercentagesPieChart({ executions, xs=12, sm, md, lg }) {
    const successExecutions = executions.filter(p => p.status === 'success');
    const failedExecutions = executions.filter(p => p.status === 'failed');
    const successPercentage = Math.round(successExecutions.length / executions.length * 100);
    const failedPercentage = Math.round(failedExecutions.length / executions.length * 100);

    return <Tile theme={TILE_THEMES.NEUTRAL} text="Build Statistics" xs={xs} sm={sm} md={md} lg={lg} >
        <div style={{ display: 'flex' }}>
            <FullOption
                data={[
                    { title: 'Success', value: successPercentage, color: TILE_THEMES_COLORS[TILE_THEMES.SUCCESS].color, backgroundColor: TILE_THEMES_COLORS[TILE_THEMES.SUCCESS].background },
                    { title: 'Failed', value: failedPercentage, color: TILE_THEMES_COLORS[TILE_THEMES.ERROR].color, backgroundColor: TILE_THEMES_COLORS[TILE_THEMES.ERROR].background },
                ]}
            />
            <ul>
                <li><strong>{executions.length}</strong> total builds</li>
                <li><strong>{successExecutions.length}</strong> successfull ({successPercentage}%)</li>
                <li><strong>{failedExecutions.length}</strong> failed ({failedPercentage}%)</li>
            </ul>
        </div>
    </Tile>;
}
