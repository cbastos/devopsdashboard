import '../_shared/Work/Work.css';
import React, { useEffect, useState } from 'react';
import { fetchApiJson } from '../_shared/fetchJson';
import { Container, CircularProgress, FormControl, Grid } from '@material-ui/core';
import { MenuItem, ListItemText, Select, Checkbox, InputLabel } from '@material-ui/core';
import IssuesReport from '../_shared/Work/IssuesReport';
import ComboBox from '../_shared/Work/ComboBox';
import { useWorkProjects } from '../_shared/commonWork';
import { useIssuesTypes } from '../_shared/commonWork';

function useIssues(selectedProjectKey, selectedIssueTypes) {
    const [issues, setIssues] = useState(null);

    useEffect(() => {
        if (selectedProjectKey && selectedIssueTypes) {
            fetchApiJson(`/jira/projects/${selectedProjectKey}?issueTypes=${selectedIssueTypes.join(',')}`).then(newIssues => {
                setIssues(newIssues);
            });
        }
    }, [selectedProjectKey, selectedIssueTypes]);
    return [issues, setIssues];
}

export default function Work() {
    const [issuesTypes] = useIssuesTypes();
    const [projects] = useWorkProjects();
    const [selectedProject, setSelectedProject] = useState({ name: 'Area Tribu Digital', key: 'ARETDIG' });
    const [selectedIssueTypes, setSelectedIssueTypes] = useState(['Bug', 'Story']);
    const [issues, setIssues] = useIssues(selectedProject?.key, selectedIssueTypes);

    if (!issues && selectedProject) {
        return <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
            <CircularProgress />
        </Grid>
    }
    return <Container style={{ paddingTop: 20 }}>
        <ComboBox label="Projects" options={projects} value={selectedProject} onChange={(newProject) => {
            setIssues(null);
            setSelectedProject(newProject);
        }} />

        {issues && <React.Fragment>
            <FormControl style={{ width: 300, marginLeft: 20}}>
                <InputLabel>Issue types</InputLabel>
                <Select
                    multiple
                    value={selectedIssueTypes}
                    renderValue={(selected) => selected.join(', ')}
                    onChange={({ target: { value } }) => { setIssues(null); setSelectedIssueTypes(value); }}
                >
                    {issuesTypes.map(({ name }) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selectedIssueTypes.includes(name)} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div>
                {selectedIssueTypes.map((issueType) =>
                    <IssuesReport key={issueType} title={issueType} issues={issues[issueType]} />
                )}
            </div>
        </React.Fragment>}
    </Container>;
}
