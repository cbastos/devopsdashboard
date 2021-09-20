import React, { useEffect, useState } from 'react';
import { GITLAB_URL, GROUP_PERMISSION_ICON } from '../_shared/config';
import { CircularProgress, MenuItem, ListItemText, Grid, Select, TextField, Container, Checkbox, FormControl, InputLabel, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BuildTimeAverageTile from './Jenkins/metrics/BuildTimeAverageTile';
import IdleJobTimeAverageTile from './Jenkins/metrics/IdleJobTimeAverageTile';
import FailureResolutionDaysAverageTile from './Jenkins/metrics/FailureResolutionDaysAverageTile';
import BuildStatusPercentagesPieChart from './Jenkins/metrics/BuildStatusPercentagesPieChart';
import Pipeline from './Pipeline';
import ExternalLinkIcon from '../_shared/ExternalLinkIcon';
import TileGroup from '../_shared/TileGroup';
import useProjects from '../_shared/useProjects';
import useOrganizationIdFromUrl from '../_shared/useOrganizationIdFromUrl';
import ProjectAnalizer from './_shared/projectAnalizer';
import { SonarProjectsMetricAverageTile } from './CodeQualitySummary/CodeQualitySummary';
import DownloadProjectsReportButton from './DownloadProjectsReportButton';
import checkScrollBar from '../_shared/checkscroll';
import commonStyles from '../_shared/commonstyles';
import useProjectTypes from '../_shared/useProjectsTypes';
import getMetricSummatoryFrom from '../_shared/commonDevops';
import getMetricAverageFrom from '../_shared/commonDevops';
import { useParams } from "react-router-dom";


const Branches = { MASTER: 'master', DEVELOP: 'develop' };
const projectAnalyzer = new ProjectAnalizer();

const useStyles = makeStyles((theme) => (commonStyles(theme)));

export default function DevOps() {
    const [branch, setBranch] = useState(Branches.DEVELOP);
    const [loadingScroll, setLoadingScroll] = useState(true);
    const [organizationId] = useOrganizationIdFromUrl(useParams);
    const [limit, setLimit] = useState(0);
    const [executions] = useProjects(organizationId, branch, limit ? limit : 0, null, setLoadingScroll, loadingScroll ? loadingScroll : false);
    const [selectedLayers, setSelectedLayers] = useState([]);
    const [projectTypes] = useProjectTypes((newProjectTypes) => setSelectedLayers(newProjectTypes.map(pt => pt.id)));
    const [searchedText, setSearchedText] = useState('');
    const classes = useStyles();

    checkScrollBar(limit, setLimit, loadingScroll);

    const loadBranch = ({ target: { value } }) => {
        setBranch(value)
    };
    const filteredProjectExecutions = executions.filter(
        ({ project }) => searchedText ? project.name.includes(searchedText) : true &&
            selectedLayers.includes(project.projecttypeid)
    );
    
    let mergedFilteredExecutions = [];
    filteredProjectExecutions.forEach(
        ({ executions: filteredExecutions }) => mergedFilteredExecutions = [...mergedFilteredExecutions, ...filteredExecutions]
        );
        const loading = executions.length === 0;
        
    const projectsCodeCoverageAverage = getMetricAverageFrom(filteredProjectExecutions, 'coverage');
    const projectsBugsTotal = getMetricSummatoryFrom(filteredProjectExecutions, 'bugs');
    const technicalDebtTotal = getMetricSummatoryFrom(filteredProjectExecutions, 'sqale_index');
    const vulnerabilitiesTotal = getMetricSummatoryFrom(filteredProjectExecutions, 'vulnerabilities');

    return <Container>
        <form noValidate autoComplete="off">
            <TextField className={classes.formControlTextField} id="search" label="Search..." variant="filled" value={searchedText} onChange={({ target: { value } }) => setSearchedText(value)} />

            <FormControl className={classes.formControl}>
                <InputLabel>Project type</InputLabel>
                <Select
                    multiple
                    value={selectedLayers}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                    onChange={({ target: { value } }) => setSelectedLayers(value)}
                >
                    {projectTypes.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                            <Checkbox checked={selectedLayers.includes(id)} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            
            <FormControl className={classes.formControl}>
                <InputLabel>Branch</InputLabel>
                <Select value={branch} onChange={loadBranch}>
                    {Object.keys(Branches).map(k => {
                        const branchValue = Branches[k];
                        return <MenuItem key={branchValue} value={branchValue}> <ListItemText primary={branchValue} /> </MenuItem>
                    })}
                </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
                <DownloadProjectsReportButton projects={filteredProjectExecutions} />
            </FormControl>
        </form>

        
        {mergedFilteredExecutions.length > 0 ? <TileGroup spacing={2}>
            <Grid container item xs={12} sm={8} spacing={2}>
                <SonarProjectsMetricAverageTile metric='coverage' value={projectsCodeCoverageAverage} md={3} sm={4}></SonarProjectsMetricAverageTile>
                <SonarProjectsMetricAverageTile metric='bugs' value={projectsBugsTotal} md={3} sm={4}></SonarProjectsMetricAverageTile>
                <SonarProjectsMetricAverageTile metric='sqale_index' value={technicalDebtTotal} md={3} sm={4}></SonarProjectsMetricAverageTile>
                <SonarProjectsMetricAverageTile metric='vulnerabilities' value={vulnerabilitiesTotal} md={3} sm={4}></SonarProjectsMetricAverageTile>
                <IdleJobTimeAverageTile executions={mergedFilteredExecutions} md={3} sm={4} />
                <BuildTimeAverageTile executions={mergedFilteredExecutions} md={3} sm={4} />
                <FailureResolutionDaysAverageTile executions={mergedFilteredExecutions} md={3} sm={4} />
            </Grid>
            <Grid item xs={12} sm={4}>
                <BuildStatusPercentagesPieChart executions={mergedFilteredExecutions} sm={12}/>
            </Grid>            
        </TileGroup> : ''}


        {loading && <CircularProgress />}
        {
            !loading && projectTypes.filter(pt => selectedLayers.includes(pt.id)).map(({ name, id, gitlabGroupPath }) => {
                let projectsOfGroupType = filteredProjectExecutions.filter(({ project }) => project.projecttypeid === id).sort((pa, pb) => {
                    const paErrors = projectAnalyzer.getErrorsOf(pa.project, pa.executions);
                    const pbErrors = projectAnalyzer.getErrorsOf(pb.project, pb.executions);
                    return pbErrors.length - paErrors.length;
                });

                const erroneousProjectsCount = projectsOfGroupType.filter(p => {
                    return projectAnalyzer.getErrorsOf(p.project, p.executions).length > 0;
                }).length;

                return <div key={id}>
                    {
                        projectsOfGroupType.length ? <h2>
                            {name} ({`${projectsOfGroupType.length} projects, ${erroneousProjectsCount} with errors`})
                            <ExternalLinkIcon 
                                src={GROUP_PERMISSION_ICON}
                                href={`${GITLAB_URL}/groups/${gitlabGroupPath}/-/group_members`}
                            />
                        </h2> : ''
                    }
                    {
                        projectsOfGroupType.map(({ project, executions: projectExecutions }) => {
                            return <Pipeline key={project.id} project={project} executions={projectExecutions} branch={branch} />
                        })
                    }
                </div>
            })
        }

    </Container>;
}