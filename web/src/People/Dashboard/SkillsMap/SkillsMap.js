import React, { useState, useEffect } from 'react';
import { Input, Checkbox, ListItemText, MenuItem, Select, FormControl, InputLabel, Typography, Paper } from '@material-ui/core';
import { Scatter } from 'react-chartjs-2';
import { fetchApiJson } from '../../../_shared/fetchJson';

// TODO: remove duplicity
function useSkills(callback) {
    const [skills, setSkills] = useState({ topics: [], knowledgeLevels: [], experienceRanges: [] });
    useEffect(() => {
        fetchApiJson('/skills').then((newSkills) => {
            setSkills(newSkills);
            callback(newSkills);
        });
    }, []);
    return [skills];
}

export default function SkillsMap({ employees }) {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skills] = useSkills(newSkills => setSelectedSkills([newSkills.topics[0].id]));

    return  <Paper style={{ width: '100%', padding: 20}} elevation={3}>
        <Typography align="center" variant="h6"><b>Skills Map</b></Typography>
        <FormControl>
            <InputLabel>Select skills</InputLabel>
            <Select
                multiple
                value={selectedSkills}
                input={<Input />}
                renderValue={(selected) => {
                    if (selected.length > 5) {
                        return 'More than 5 skills selected...';
                    }
                    return selected.map(id => skills.topics.find(t => t.id === id).name).join(', ')
                }}
                onChange={({ target: { value } }) => setSelectedSkills(value)}
            >
                {skills.topics.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                        <Checkbox checked={selectedSkills.includes(id)} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>
            {selectedSkills.length === 0 && <span> Select some skills...</span>}
        </FormControl>
        {
            selectedSkills.length > 0 &&
            <Scatter
                height={30}
                width={100}
                data={getDataSetFor(employees, selectedSkills)}
                options={getOptionsFor(skills)}
            />
        }
    </Paper>
}

function getDataSetFor(employees, selectedSkills) {
    const employeesSkillsAverage = getSkillsAveragesOf(employees, selectedSkills);
    const radius = employeesSkillsAverage.map(e => {
        const matches = employeesSkillsAverage.filter(eka =>
            eka.averages.knowledge === e.averages.knowledge &&
            eka.averages.experience === e.averages.experience
        ).length;
        return 2 * matches;
    });
    return ({
        datasets: [
            {
                label: 'Developers',
                data: employeesSkillsAverage.map(e =>
                ({
                    x: e.averages.knowledge,
                    y: e.averages.experience,
                    label: `${e.name} ${e.surname}`
                })),
                backgroundColor: '#79acd9',
                pointRadius: radius,
                pointHoverRadius: radius
            },
        ],
    });
}


function getSkillsAveragesOf(employees, selectedSkills) {
    // TODO: replace average of "id" with average of "value"
    return employees.map(e => {
        let skills = e.skills.filter(s => selectedSkills.find(ss => ss === s.skillid))
        let knowledgeTotal = 0;
        let experienceTotal = 0;
        skills.forEach(s => {
            knowledgeTotal += s.knowledgelevelid;
            experienceTotal += s.experiencerangeid;
        });
        const knowledgeAverage = knowledgeTotal / skills.length;
        const experienceAverage = experienceTotal / skills.length;
        return { ...e, averages: { knowledge: knowledgeAverage, experience: experienceAverage } };
    });
}


function getOptionsFor(skills) {
    const AXES_MIN = 1;
    return {
        responsive:true,
        scales: {
            yAxes: [{
                ticks: {
                    callback: (value) => skills.experienceRanges.find(({ id }) => id === value)?.name,
                    suggestedMin: AXES_MIN,
                    suggestedMax: skills.experienceRanges.length
                }
            }],
            xAxes: [{
                ticks: {
                    callback: (value) => skills.knowledgeLevels.find(({ id }) => id === value)?.name
                },
                suggestedMin: AXES_MIN,
                suggestedMax: skills.knowledgeLevels.length
            }]
        },
        tooltips: {
            callbacks: {
                label: ({ datasetIndex, index }, data) => data.datasets[datasetIndex].data[index].label
            }
        }
    }
}