import React, { useState } from 'react';
import {
    Checkbox, Badge, Chip, Typography, MenuItem, Select, Grid, 
    Container, FormControl, InputLabel, FormControlLabel, Button, Paper
} from '@material-ui/core';
import { Face, Add, Remove, ZoomIn } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import ExternalLink from '../../_shared/ExternalLink';
import Detail from './Detail/Detail';
import getBadgesRoles from '../../_shared/commonEmployees';

const BADGES_ROLES = getBadgesRoles();

const useStyles = makeStyles((theme) => ({
    formControl: { margin: theme.spacing(1), minWidth: 120 }
}));

const ALL_OPTION = 'all';

export default function Teams({ setEmployees, teams, employees }) {
    const [showOnlyWithProblems, setShowOnlyWithProblems] = useState(false);
    const [selectedTeamIdFilter, setTeamFilter] = useState(ALL_OPTION);
    const [developerFilter, setDeveloperFilter] = useState(ALL_OPTION);
    const classes = useStyles();

    function toggle(item) {
        item.showMore = !item.showMore;
        setEmployees(Array.from(employees));
    }

    return <React.Fragment>
        <form noValidate autoComplete="off">
            <FormControl className={classes.formControl}>
                <InputLabel>Team</InputLabel>
                <Select
                    value={selectedTeamIdFilter}
                    onChange={({ target: { value: teamId } }) => setTeamFilter(teamId === ALL_OPTION ? teamId : parseInt(teamId))}
                >
                    <MenuItem value={ALL_OPTION}>All</MenuItem>
                    {
                        teams.map(team =>
                            <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel>Person</InputLabel>
                <Select
                    value={developerFilter}
                    onChange={({ target: { value: developerUsername } }) => { setDeveloperFilter(developerUsername) }}
                >
                    <MenuItem value={ALL_OPTION}>All</MenuItem>
                    {
                        selectedTeamIdFilter === ALL_OPTION ?
                            employees.map(d =>
                                <MenuItem key={d.username} value={d.username}>{`${d.name} ${d.surname}`}</MenuItem>
                            )
                            :
                            teams.find(t => t.id === selectedTeamIdFilter).employees.map(d =>
                                <MenuItem key={d.username} value={d.username}>{`${d.name} ${d.surname}`}</MenuItem>
                            )
                    }
                </Select>
            </FormControl>
           

            <FormControlLabel
                control={
                    <Checkbox checked={showOnlyWithProblems} onChange={() => setShowOnlyWithProblems(!showOnlyWithProblems)} />
                }
                label="Only problems"
            />
        </form>
        <Grid container spacing={2} id="teams">
            {
                teams
                .filter(t => selectedTeamIdFilter === ALL_OPTION || t.id === selectedTeamIdFilter)
                .map(team => {
                    for (let newEmpTeam of team.employees) {
                        newEmpTeam['projects'] = []
                        for (let newEmp of employees) {
                            if (newEmpTeam.username === newEmp.username) {
                                newEmpTeam['projects'] = newEmp['projects']
                            }
                        }
                    }
                    const teamEmployees = team.employees.filter(e => (developerFilter === ALL_OPTION || e.username === developerFilter));
                    return <React.Fragment key={team.id.toString()}>
                        <Grid item xs={12} sm={12} md={6} lg={4} container spacing={0}>
                            <Paper square key={`paper-${team.id.toString()}`} style={{ width: '100%', padding: "40 0"}} elevation={3}>
                                <Container key={`container-${team.id.toString()}`}>
                                    <Typography key={`typo-${team.id.toString()}`} align="center" variant="h6" style={{ marginBottom: 10 }}>
                                        {team.name}
                                        <small key={`small-${team.id.toString()}`}>({teamEmployees.length} members)</small>
                                        <Button key={`button-${team.id.toString()}`}>
                                            <ZoomIn key={`zoom-${team.id.toString()}`}/>
                                        </Button>
                                    </Typography>
                                    {getSummaryLinesOf(team.id, teamEmployees, showOnlyWithProblems, toggle)}
                                </Container>
                            </Paper>
                        </Grid>
                    </React.Fragment>;
                })
            }
        </Grid>
    </React.Fragment>;
}

function getSummaryLinesOf(teamId, employees, showOnlyWithProblems, toggle) {
    employees.sort((a, b) => (a.roleid > b.roleid) ? -1 : (a.roleid === b.roleid) ? ((a.roleid > b.roleid) ? -1 : 1) : 1)
    return employees.filter(d => showOnlyWithProblems ? shouldShowAlarmFor(d) : true).map(d => {
        const healthColor = shouldShowAlarmFor(d) ? 'red' : 'green';
        const { tag, theme } = BADGES_ROLES[d.roleid];
        const badgeIcon = <Badge badgeContent={tag} color={theme}><Face /></Badge>;
        const CollapseIcon = d.showMore ? Remove : Add;
        const userProfileLink = <React.Fragment>
            <ExternalLink key={`link-${teamId.toString()}`} href={d.activity}>{`${d.name} ${d.surname}`}</ExternalLink>
            <CollapseIcon key={`icon-${teamId.toString()}`} fontSize="small" onClick={() => toggle(d)}></CollapseIcon>
        </React.Fragment>;
        return <div key={`team-${teamId.toString()}-user-${d.id.toString()}`} style={{ width: '100%' }}>
            <div key={`team-${teamId.toString()}-user-el-${d.id.toString()}`} style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}>
                <span key={`team-${teamId.toString()}-user-el-span-${d.id.toString()}`} className={`health ${healthColor}`}></span>
                <Chip key={`team-${teamId.toString()}-user-el-chip-${d.id.toString()}`} icon={badgeIcon} label={userProfileLink} variant="outlined" >
                </Chip>
            </div>
            <div>{d.showMore && getProjectsExpandedInfoOf(d, toggle)}</div>
        </div>;
    });
}

function shouldShowAlarmFor(developer) {
    if (!developer.projects) {
        return false;
    }
    const doesNotHaveWork = developer.projects.length === 0;
    return doesNotHaveWork;
}

function getProjectsExpandedInfoOf(developer, toggle) {
    const open = true;
    const handleClose = () => { toggle(developer); };

    return <React.Fragment>
        <Detail
            key={developer}
            developer={developer}
            toggle={toggle}
            open={open}
            handleClose={handleClose}
        />
    </React.Fragment>;
}
