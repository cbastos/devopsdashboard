import React from 'react';
import ExternalLink from '../../_shared/ExternalLink';
import { SONARQUBE_URL } from '../../_shared/config';
import { Typography } from '@material-ui/core';
import TileGroup from '../../_shared/TileGroup';
import { Tile } from '../../_shared/Tile';
import { TILE_THEMES } from '../../_shared/config';

export default function CodeQualitySummary({ sonarqubeProjectName, sonarqubeMeasures = [], executions }) {
    if (executions[0]) {
        return <div>
            <ExternalLink href={`${SONARQUBE_URL}/dashboard?id=${sonarqubeProjectName}`}><b>Open SonarQube Dashboard ››</b></ExternalLink><br /><br />
            <TileGroup spacing={1}>
                {
                    sonarqubeMeasures.map(({ metric, value }) => 
                        <SonarProjectsMetricAverageTile key={metric} metric={metric} value={value} sm={4} md={3} />
                    )
                }
            </TileGroup>
        </div>;
    } else return <div>
        <ExternalLink href={`${SONARQUBE_URL}/dashboard?id=${sonarqubeProjectName}`}><b>Open SonarQube Dashboard ››</b></ExternalLink><br />
        <Typography align="left" variant="h6">No executions found!</Typography>
    </div>;

}

const ratings = { '1.0': 'A', '2.0': 'B', '3.0': 'C', '4.0': 'D' };

export const KPIsTilesThemes = {
    bugs: { name: 'Bugs', unit: '', format: value => value, getTheme: (value) => value > 5 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.NEUTRAL },
    alert_status: { name: 'Quality gate', format: value => value === 'OK' ? 'Passing' : 'NOT Passing', unit: '', getTheme: (value) => value === 'OK' ? TILE_THEMES.SUCCESS_LOW : TILE_THEMES.ERROR_LOW },
    security_rating: { name: 'Security rating', format: value => ratings[value], unit: '', getTheme: (value) => value === '1.0' ? TILE_THEMES.SUCCESS_LOW : TILE_THEMES.ERROR_LOW },
    sqale_index: { name: 'Technical Debt', unit: 'hours', format: valueInMinutes => Math.round(valueInMinutes / 60), getTheme: (value) => value < 5 ? TILE_THEMES.SUCCESS_LOW : TILE_THEMES.ERROR_LOW },
    ncloc: { name: 'Lines of code', unit: '', format: value => numberWithCommas(value), getTheme: (value) => TILE_THEMES.NEUTRAL },
    code_smells: { name: 'Code Smells', unit: '', format: value => value, getTheme: (value) => value > 20 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.NEUTRAL },
    vulnerabilities: { name: 'Vulnerabilities', format: value => value, unit: '', getTheme: (value) => value > 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW },
    coverage: { name: 'Code coverage', format: value => value, unit: '%', getTheme: (value) => value > 70 ? TILE_THEMES.SUCCESS_LOW : TILE_THEMES.ERROR_LOW },
    duplicated_lines_density: { name: 'Duplicated lines', format: value => value, unit: '%', getTheme: (value) => value < 3 ? TILE_THEMES.SUCCESS_LOW : TILE_THEMES.ERROR_LOW },
    sqale_rating: { name: 'Mantainability', format: value => ratings[value], unit: '', getTheme: (value) => value === '1.0' ? TILE_THEMES.SUCCESS_LOW : TILE_THEMES.ERROR_LOW },
    reliability_rating: { name: 'Reliability', unit: '', format: value => ratings[value], getTheme: (value) => value === '1.0' ? TILE_THEMES.SUCCESS_LOW : TILE_THEMES.ERROR_LOW }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function SonarProjectsMetricAverageTile({ metric, value, xs=12, sm, md, lg }) {
    const tileTheme = KPIsTilesThemes[metric] || { name: metric, getTheme() { return TILE_THEMES.NEUTRAL } };
    return <Tile key={metric} theme={tileTheme.getTheme(value)} text={tileTheme.name} xs={xs} sm={sm} md={md} lg={lg} >
        <Typography align="center" variant="h5"><b>{tileTheme.format(value)}</b> {tileTheme.unit}</Typography>
    </Tile>
}