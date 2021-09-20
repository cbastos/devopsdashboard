import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { format } from 'date-fns';
import parse from 'date-fns/parse';
import {
    Input, Checkbox, Badge, Chip, Typography, MenuItem, Select, Box,
    Container, FormControl, InputLabel, FormControlLabel, Button
} from '@material-ui/core';
import { Face, Add, Remove } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Detail from './Detail/Detail';
import { TILE_THEMES, Roles } from '../_shared/config';
import { fetchApiJson } from '../_shared/fetchJson';
import useProjects from '../_shared/useProjects';
import { Tile } from '../_shared/Tile';
import TileGroup from '../_shared/TileGroup';
import ExternalLink from '../_shared/ExternalLink';
import useOrganizationIdFromUrl from '../_shared/useOrganizationIdFromUrl';
import SkillsMap from './OrganizationSkillsMap/SkillsMap';
import { useParams } from "react-router-dom";


const BADGES_ROLES = {
    [Roles.SE_I]: { tag: 'DEV', theme: 'secondary' },
    [Roles.SE_II]: { tag: 'DEV', theme: 'secondary' },
    [Roles.S_SE_I]: { tag: 'SDEV', theme: 'secondary' },
    [Roles.S_SE_II]: { tag: 'SDEV', theme: 'secondary' },
    [Roles.TECHNICAL_LEAD]: { tag: 'TL', theme: 'primary' },
};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function useEmployees(afterDateLimit) {
    const [organizationId] = useOrganizationIdFromUrl(useParams);
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        setEmployees([]);
        const afterDateLimitString = format(afterDateLimit, 'yyyy-MM-dd');
        fetchApiJson(`/employees?organizationId=${organizationId}&afterDateLimit=${afterDateLimitString}`).then((newEmployees) => {
            setEmployees(newEmployees);
        });
    }, [organizationId, afterDateLimit]);
    return [employees, setEmployees];
}

function useTeamsOf(organizationId) {
    const [teams, setTeams] = useState([]);
    useEffect(() => {
        fetchApiJson(`/organizations/${organizationId}/teams`).then((newTeams) => setTeams(newTeams));
    }, [organizationId]);
    return [teams];
}

const useStyles = makeStyles((theme) => ({
    formControl: { margin: theme.spacing(1), minWidth: 120 },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: '100%',
    },
    tabs: { borderRight: `1px solid ${theme.palette.divider}`, height: '100%' },
}));


import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

function TabPanel({ children, value, index }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            style={{ width: 'calc(100% - 160px)' }}
            aria-labelledby={`vertical-tab-${index}`}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function Developers() {
    const [selectedTab, setSelectedTab] = useState(0);

    const [showOnlyWithProblems, setShowOnlyWithProblems] = useState(false);
    const query = useQuery();
    const classes = useStyles();
    const [selectedTeamIdFilter, setTeamFilter] = useState('all');
    const [developerFilter, setDeveloperFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState(parseInt(query.get('projectId')) || 'all');
    const [afterDateLimit, setAfterDateLimit] = useState(new Date('2020-03-01'));
    const [employees, setEmployees] = useEmployees(afterDateLimit);
    const [organizationId] = useOrganizationIdFromUrl(useParams);
    const [projects] = useProjects(organizationId);
    const [teams] = useTeamsOf(organizationId);

    function toggle(item) {
        item.showMore = !item.showMore;
        setEmployees(Array.from(employees));
    }
    const members = employees.filter(d => d.roleid === Roles.SE_I).length;
    const chapterRepresentants = employees.filter(d => d.roleid === Roles.TECHNICAL_LEAD).length;
    const developersWithoutUsername = employees.filter(d => !d.username);
    const developersWithoutSlackUsername = employees.filter(d => !d.slackId);
    const user_teams = {};
    teams.forEach(t => t.employees.forEach(d => user_teams[d.name + ' ' + d.surname] = user_teams[d.name + ' ' + d.surname] ? user_teams[d.name + ' ' + d.surname] + 1 : 1));
    const developersInMultipleTeams = Object.keys(user_teams).filter(u => user_teams[u] > 1).map(u => u);

    return <div className={classes.root}>
        <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="primary"
            orientation="vertical"
            onChange={(event, newTab) => { setSelectedTab(newTab); }}
            className={classes.tabs}
        >
            <Tab label="Dashboard" />
            <Tab label="Teams" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
            <TileGroup spacing={1}>
                <Tile theme={TILE_THEMES.NEUTRAL} text="Teams" xs={12} sm={6} md={3}>
                    <Typography align="center" variant="h4"><b>{teams.length}</b></Typography>
                </Tile>
                <Tile theme={TILE_THEMES.NEUTRAL} text="Members" xs={12} sm={6} md={3}>
                    <Typography align="center" variant="h4"><b>{employees.length}</b></Typography>
                </Tile>
                <Tile theme={TILE_THEMES.NEUTRAL} text="Developers" xs={12} sm={6} md={3}>
                    <Typography align="center" variant="h4"><b>{members}</b></Typography>
                </Tile>
                <Tile theme={TILE_THEMES.NEUTRAL} text="Chapter representants" xs={12} sm={6} md={3}>
                    <Typography align="center" variant="h4"> <b>{chapterRepresentants}</b></Typography>
                </Tile>
                <Tile theme={developersWithoutUsername.length > 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.NEUTRAL} title={developersWithoutUsername.map(d => d.name + ' ' + d.surname).join(', ')} text="Devs without Gitlab Account" xs={12} sm={4}>
                    <Typography align="center" variant="h4"><b>{developersWithoutUsername.length}</b></Typography>
                </Tile>
                <Tile theme={developersWithoutSlackUsername.length > 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.NEUTRAL} title={developersWithoutSlackUsername.map(d => d.name + ' ' + d.surname).join(', ')} text="Devs without Slack Account" xs={12} sm={4}>
                    <Typography align="center" variant="h4"><b>{developersWithoutSlackUsername.length}</b></Typography>
                </Tile>
                <Tile theme={developersInMultipleTeams.length > 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} title={developersInMultipleTeams.join(', ')} text="Devs in multiple teams" xs={12} sm={4}>
                    <Typography align="center" variant="h4"><b>{developersInMultipleTeams.length}</b></Typography>
                </Tile>
            </TileGroup>
            <SkillsMap employees={employees} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
            <form noValidate autoComplete="off">
                <FormControl className={classes.formControl}>
                    <InputLabel>Team</InputLabel>
                    <Select
                        value={selectedTeamIdFilter}
                        onChange={({ target: { value: teamId } }) => setTeamFilter(teamId === 'all' ? teamId : parseInt(teamId))}
                    >
                        <MenuItem value="all">All</MenuItem>
                        {
                            teams.map(team =>
                                <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel>Developer</InputLabel>
                    <Select
                        value={developerFilter}
                        onChange={({ target: { value: developerUsername } }) => { setDeveloperFilter(developerUsername) }}
                    >
                        <MenuItem value="all">All</MenuItem>
                        {
                            selectedTeamIdFilter === 'all' ?
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

                <FormControl className={classes.formControl}>
                    <InputLabel>Project</InputLabel>
                    <Select
                        value={projectFilter}
                        onChange={({ target: { value: projectId } }) => setProjectFilter(parseInt(projectId))}
                    >
                        <MenuItem value="all">All</MenuItem>
                        {
                            projects.map(p =>
                                <MenuItem key={p.project.id} value={p.coderepositoryid}>{p.project.name}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel>Activity since</InputLabel>
                    <Input type="date" defaultValue={format(afterDateLimit, 'yyyy-MM-dd')} onChange={({ target: { value } }) => setAfterDateLimit(parse(value, 'yyyy-MM-dd', new Date()))} />
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox checked={showOnlyWithProblems} onChange={({ target: { checked } }) => setShowOnlyWithProblems(checked === 'true')} />
                    }
                    label="Only problems"
                />
            </form>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {
                    teams.filter(t => selectedTeamIdFilter === 'all' || t.id === selectedTeamIdFilter).map(team => {
                        for (let newEmpTeam of team.employees) {
                            newEmpTeam['projects'] = []
                            for (let newEmp of employees) {
                                if (newEmpTeam.username === newEmp.username) {
                                    newEmpTeam['projects'] = newEmp['projects']
                                }
                            }
                        }
                        const teamEmployees = team.employees.filter(e => (developerFilter === 'all' || e.username === developerFilter));
                        return <Paper square key={`team-${team.id}`} style={{ width: '32%', margin: 5, padding: 20 }}>
                            <Container>
                                <Typography align="center" variant="h6" style={{ marginBottom: 10 }}>
                                    {team.name} 
                                    <small>({teamEmployees.length} members)</small>
                                    <Button><ZoomInIcon /></Button>
                                </Typography>
                                {getSummaryLinesOf(team.id, teamEmployees, showOnlyWithProblems, toggle, projectFilter)}
                            </Container>
                        </Paper>;
                    })
                }
            </div>
        </TabPanel>
    </div>;
}

function getSummaryLinesOf(teamId, employees, showOnlyWithProblems, toggle, projectFilter) {
    employees.sort((a, b) => (a.roleid > b.roleid) ? -1 : (a.roleid === b.roleid) ? ((a.roleid > b.roleid) ? -1 : 1) : 1)
    return employees.filter(d => showOnlyWithProblems ? shouldShowAlarmFor(d) : true).map(d => {
        const healthColor = shouldShowAlarmFor(d) ? 'red' : 'green';
        const developerProjects = d.projects.filter(p => projectFilter === 'all' || p.id === projectFilter);
        const { tag, theme } = BADGES_ROLES[d.roleid];
        const badgeIcon = <Badge badgeContent={tag} color={theme}><Face /></Badge>;
        const CollapseIcon = d.showMore ? Remove : Add;
        const userProfileLink = <React.Fragment>
            <ExternalLink href={d.activity}>{`${d.name} ${d.surname}`}</ExternalLink>
            <CollapseIcon fontSize="small" onClick={() => toggle(d)}></CollapseIcon>
        </React.Fragment>;
        return <div key={`team-${teamId}-user-${d.username}`} style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span className={`health ${healthColor}`}></span>
                <Chip icon={badgeIcon} label={userProfileLink} variant="outlined" >
                </Chip>
            </div>
            <div>{d.showMore && getProjectsExpandedInfoOf(d, developerProjects, toggle, projectFilter)}</div>
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

function getProjectsExpandedInfoOf(developer, projects, toggle, projectFilter) {
    const open = true;
    const handleClose = () => { toggle(developer); };

    return <React.Fragment>
        <Detail
            developer={developer}
            projects={projects}
            projectFilter={projectFilter}
            toggle={toggle}
            open={open}
            handleClose={handleClose}
        />
    </React.Fragment>;
}