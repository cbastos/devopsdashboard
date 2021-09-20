import React, { useState } from 'react';
import { MenuItem, ListItemText, Select, FormControl, InputLabel } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ENVIRONMENT_BAR_COLORS = {
    pro: 'darkgreen',
    uat: 'deepskyblue',
    uat2: 'midnightblue',
    ent1: 'mediumturquoise',
    ent2: 'paleturquoise',
    ase: 'palegreen'
};
const CURRENT_YEAR = new Date().getFullYear();
const PREVIOUS_YEAR = CURRENT_YEAR - 1;

export default function MonthlyDeployments({ deployments }) {
    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

    return <div>
        <FormControl>
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} onChange={({ target: { value } }) => setSelectedYear(value)}>
                <MenuItem key={CURRENT_YEAR} value={CURRENT_YEAR}> <ListItemText primary={CURRENT_YEAR} /> </MenuItem>
                <MenuItem key={PREVIOUS_YEAR} value={PREVIOUS_YEAR}> <ListItemText primary={PREVIOUS_YEAR} /> </MenuItem>
            </Select>
        </FormControl>
        <Bar
            height={10}
            width={'50%'}
            data={{
                labels: MONTHS,
                datasets: deployments?.statistics.deployments.periods.map(p => {
                    const months = p.years.find(y => y.year == selectedYear)?.months;
                    return {
                        label: p.environment,
                        data: MONTHS.map((m, i) => {
                            const l = months?.find(mo => mo.month === m)?.deployments?.length || 0;
                            return { x: i, y: l }
                        }
                        ),
                        backgroundColor: ENVIRONMENT_BAR_COLORS[p.environment],
                    };
                })
            }}
            options={{
                scales: {
                    yAxes: [{ stacked: true, ticks: { min: 0, stepSize: 1 } }],
                    xAxes: [{ stacked: true, startsAt: 0 }],
                }
            }}
        />
    </div>;
}