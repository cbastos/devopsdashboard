
import React from 'react';
import { Tile } from '../Tile';
import { TILE_THEMES } from '../config';
import TileGroup from '../TileGroup';
import { Container, Typography } from '@material-ui/core';
import StateDistributionBar from './StateDistributionBar';

export default function IssuesReport({ title, issues }) {
    const {
        blocked_time_average, cycle_time_average, dev_time_average, pingpong_assignee_average,
        test_time_average, to_do_time_average, items, opened_count, last_week_count, resolve_time_average, antiquity_average
    } = issues;

    const total_deviation_in_working_days = get_total_working_days_deviation_of(items);
    const working_time_average = to_do_time_average + dev_time_average + test_time_average;

    return <Container style={{ padding: 0 }}>
        <fieldset style={{ background: 'aliceblue' }}>            
            <legend><Typography align="center" variant="h6"><b>{title}</b> ({items.length} items)</Typography></legend>
            {items.length == 0 && <i>There is no items to show metrics</i>}
            {items.length > 0 && <div>
                <TileGroup spacing={1}>
                    <Tile text="Total deviation" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{total_deviation_in_working_days * -1}</b> days</Typography>
                    </Tile>

                    <Tile text="Cycle time" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{toOneDecimal(cycle_time_average)}</b> days </Typography>
                    </Tile>
                    <Tile text="To Do average" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{toOneDecimal(to_do_time_average)}</b> days</Typography>
                    </Tile>
                    <Tile text="Working Average" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{toOneDecimal(working_time_average)}</b> days</Typography>
                    </Tile>
                    <Tile text="In progress average" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{toOneDecimal(dev_time_average)}</b> days</Typography>
                    </Tile>
                    <Tile text="Test average" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{toOneDecimal(test_time_average)}</b> days</Typography>
                    </Tile>
                    <Tile text="Resolve average" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{toOneDecimal(resolve_time_average)}</b> days</Typography>
                    </Tile>
                    <Tile text="Blocked average" theme={TILE_THEMES.ERROR_LOW} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{toOneDecimal(blocked_time_average)}</b> days</Typography>
                    </Tile>
                    <Tile text="Opened issues" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{opened_count}</b> issues</Typography>
                    </Tile>
                    <Tile text="Last week opened" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{last_week_count}</b> issues</Typography>
                    </Tile>
                    <Tile text="Open antiquity average" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{toOneDecimal(antiquity_average)}</b> days</Typography>
                    </Tile>
                    <Tile text="PingPong average" theme={TILE_THEMES.NEUTRAL} xs={12} sm={3} md={3}>
                        <Typography align="center" variant="h5"><b>{toOneDecimal(pingpong_assignee_average)}</b> assignees</Typography>
                    </Tile>
                </TileGroup>
                <StateDistributionBar
                    to_do_time_average={to_do_time_average}
                    dev_time_average={dev_time_average}
                    test_time_average={test_time_average}
                    blocked_time_average={blocked_time_average}
                />
            </div>}
        </fieldset>
    </Container>;
}

function get_total_working_days_deviation_of(items) {
    let total_deviation_in_seconds = 0;
    items.forEach(i => {
        total_deviation_in_seconds += i.deviation.seconds || 0;
    });
    const WORKING_DAY_HOURS = 8;
    const HOUR_MINUTES = 60;
    const MINUTE_SECONDS = 60;
    const WORKING_DAY_SECONDS = WORKING_DAY_HOURS * HOUR_MINUTES * MINUTE_SECONDS;
    return Math.round(total_deviation_in_seconds / WORKING_DAY_SECONDS);
}


function toOneDecimal(number) {
    return Math.round(number * 10) / 10;
}