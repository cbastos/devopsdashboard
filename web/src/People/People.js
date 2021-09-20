import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchApiJson } from '../_shared/fetchJson';
import useOrganizationIdFromUrl from '../_shared/useOrganizationIdFromUrl';
import Dashboard from './Dashboard/Dashboard';
import Teams from './Teams/Teams';
import { useParams } from "react-router-dom";
import { TabPanel } from '../_shared/TabPanel';
import { useSnackbar } from 'notistack';

function useEmployees() {
    const [organizationId] = useOrganizationIdFromUrl(useParams);
    const [employees, setEmployees] = useState([]);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(() => {
        setEmployees([]);
        fetchApiJson(`/employees?organizationId=${organizationId}`).then((newEmployees) => {
            setEmployees(newEmployees);
            enqueueSnackbar('Employees loaded successfully.', {variant: 'success'});
        }).catch((e) =>{
            enqueueSnackbar('Error getting employees.', {variant: 'error'});
        });
    }, [organizationId]);
    return [employees, setEmployees];
}

function useTeamsOf(organizationId) {
    const [teams, setTeams] = useState([]);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(() => {
        fetchApiJson(`/organizations/${organizationId}/teams`).then((newTeams) => {
            setTeams(newTeams);
            enqueueSnackbar('Teams loaded successfully.', {variant: 'success'});
        }).catch((e) =>{
            enqueueSnackbar('Error getting teams.', {variant: 'error'});
        });
    }, [organizationId]);
    return [teams];
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: `calc(100% - 70px)`,
    },
    tabs: { borderRight: `1px solid ${theme.palette.divider}`, height: '100%' },
}));

export default function People() {
    const [selectedTab, setSelectedTab] = useState(0);
    const classes = useStyles();
    const [employees, setEmployees] = useEmployees();
    const [organizationId] = useOrganizationIdFromUrl(useParams);
    const [teams] = useTeamsOf(organizationId);

    return <div className={classes.root}>
        <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="primary"
            orientation="vertical"
            onChange={(...[, newTab]) => { setSelectedTab(newTab); }}
            className={classes.tabs}
        >
            <Tab label="Dashboard" />
            <Tab label="Teams" />
        </Tabs>

        <TabPanel value={selectedTab} index={0} >
            <Dashboard employees={employees} teams={teams}/>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
            <Teams teams={teams} employees={employees} setEmployees={setEmployees} />
        </TabPanel>
    </div>;
}