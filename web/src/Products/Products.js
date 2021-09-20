import '../_shared/Work/Work.css';
import React, { useState, useEffect } from 'react';
import IssuesReport from '../_shared/Work/IssuesReport';
import ComboBox from '../_shared/Work/ComboBox';
import { GITLAB_URL, GROUP_PERMISSION_ICON } from '../_shared/config';
import { CircularProgress, Grid, Button, Paper} from '@material-ui/core';
import BuildTimeAverageTile from '../DevOps/Jenkins/metrics/BuildTimeAverageTile';
import IdleJobTimeAverageTile from '../DevOps/Jenkins/metrics/IdleJobTimeAverageTile';
import FailureResolutionDaysAverageTile from '../DevOps/Jenkins/metrics/FailureResolutionDaysAverageTile';
import BuildStatusPercentagesPieChart from '../DevOps/Jenkins/metrics/BuildStatusPercentagesPieChart';
import Pipeline from '../DevOps/Pipeline';
import ProjectAnalizer from '../DevOps/_shared/projectAnalizer';
import { SonarProjectsMetricAverageTile } from '../DevOps/CodeQualitySummary/CodeQualitySummary';
import ExternalLinkIcon from '../_shared/ExternalLinkIcon';
import { useLocation } from "react-router-dom";
import { format } from 'date-fns';
import { Badge, Chip, Checkbox, Container, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@material-ui/core';
import { Face, Add, Remove } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Detail from '../People/Teams/Detail/Detail';
import { fetchApiJson } from '../_shared/fetchJson';
import useProjects from '../_shared/useProjects';
import ExternalLink from '../_shared/ExternalLink';
import checkScrollBar from '../_shared/checkscroll';
import TileGroup from '../_shared/TileGroup';
import useOrganizationIdFromUrl from '../_shared/useOrganizationIdFromUrl';
import commonStyles from '../_shared/commonstyles';
import useProjectTypes from '../_shared/useProjectsTypes';
import getMetricSummatoryFrom from '../_shared/commonDevops';
import getMetricAverageFrom from '../_shared/commonDevops';
import getBadgesRoles from '../_shared/commonEmployees';
import { useWorkProjects } from '../_shared/commonWork';
import { useIssuesTypes } from '../_shared/commonWork';
import { Roles } from '../_shared/config';
import { useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';


const BADGES_ROLES = getBadgesRoles();

const ProjectTypes = {
    FACTORY: 'factory',
    UNKNOWN: 'unknown'
}

const Branches = { MASTER: 'master', DEVELOP: 'develop', pi2: 'feature-pi2', pi3: 'feature-pi3' };
const projectAnalyzer = new ProjectAnalizer();

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

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

function useEmployees(afterDateLimit) {
    const [organizationId] = useOrganizationIdFromUrl(useParams);
    const [employees, setEmployees] = useState([]);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(() => {
        setEmployees([]);
        const afterDateLimitString = format(afterDateLimit, 'yyyy-MM-dd');
        fetchApiJson(`/employees?organizationId=${organizationId}&afterDateLimit=${afterDateLimitString}`).then((newEmployees) => {
            for(let empl of newEmployees) {
                empl['employeeid'] = empl.id;
            }
            setEmployees(newEmployees);
        }).catch((e) =>{
            enqueueSnackbar('Error getting Employees.', {variant: 'error'});
        });
        
    }, [organizationId, afterDateLimit]);
    return [employees, setEmployees];
}

function useProductsOf(organizationId, setProductFilter) {
    const [products, setProducts] = useState([]);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(() => {
        fetchApiJson(`/organizations/${organizationId}/products`).then((newProducts) => {
            setProducts(newProducts); 
            setProductFilter(newProducts[0].id);
        }).catch((e) =>{
            enqueueSnackbar('Error getting Products.', {variant: 'error'});
        });
    }, [organizationId]);
    return [products];
}

function useProductsProjectsOf(organizationId) {
    const [productsProjects, setProductsProjects] = useState([]);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(() => {
        fetchApiJson(`/productsprojects`).then((newProductsProjects) => {
            setProductsProjects(newProductsProjects);
        }).catch((e) =>{
            enqueueSnackbar('Error getting Projects of Product.', {variant: 'error'});
        });
    }, [organizationId]);
    return [productsProjects];
}

function useJiraTribeProductOf(organizationId, selectedProductIdFilter) {
    const [jiraTribeProducts, setJiraTribeProducts] = useState([]);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(() => {
        fetchApiJson(`/jiratribeproducts?organizationId=${organizationId}&productId=${selectedProductIdFilter}`).then((newJiraTribeProduct) => {
            setJiraTribeProducts(newJiraTribeProduct);
        }).catch((e) =>{
            enqueueSnackbar('Error getting JIRA projects.', {variant: 'error'});
        });
    }, [organizationId, selectedProductIdFilter]);
    return [jiraTribeProducts];
}

function useEmployeesTribeProduct(organizationId, setLimit, selectedProductIdFilter) {
    const [employeesTribeProduct, setEmployeesTribeProduct] = useState([]);
    useEffect(() => {
        fetchApiJson(`/employeestribes?tribe=${organizationId}`).then((newEmployeesTribeProduct) => setEmployeesTribeProduct(newEmployeesTribeProduct));
        setLimit(0);
    }, [organizationId, selectedProductIdFilter]);
    return [employeesTribeProduct];
}

const useStyles = makeStyles((theme) => (commonStyles(theme)));

export default function Products() {
    //Work
    const [issuesTypes] = useIssuesTypes();
    const [projectsWork] = useWorkProjects();
    const [selectedProject, setSelectedProject] = useState();
    const [selectedIssueTypes, setSelectedIssueTypes] = useState(['Bug', 'Story']);
    const [issues, setIssues] = useIssues(selectedProject?.key, selectedIssueTypes);

    //DevOps
    const [loadingScroll, setLoadingScroll] = useState(true);
    const [selectedProductIdFilter, setProductFilter] = useState('none');
    const [organizationId] = useOrganizationIdFromUrl(useParams);
    const [branch, setBranch] = useState(Branches.DEVELOP);
    const [limit, setLimit] = useState(0);
    const [selectedLayers, setSelectedLayers] = useState([]);
    let [projects] = useProjects(organizationId, branch, limit ? limit : 0, selectedProductIdFilter, setLoadingScroll, loadingScroll ? loadingScroll : false);
    const [projectTypes] = useProjectTypes((newProjectTypes) => setSelectedLayers(newProjectTypes.map(pt => pt.id)));
    const [searchedText, setSearchedText] = useState('');
    
    // Employees
    const [showOnlyWithProblems, setShowOnlyWithProblems] = useState(false);
    const query = useQuery();
    const classes = useStyles();
    const [developerFilter, setDeveloperFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState(parseInt(query.get('projectId')) || 'all');
    const [afterDateLimit, setAfterDateLimit] = useState(new Date('2020-03-01'));
    const [employees, setEmployees] = useEmployees(afterDateLimit);
    const [products] = useProductsOf(organizationId, setProductFilter);
    const [productsProjects] = useProductsProjectsOf(organizationId);
    const [jiraTribeProducts] = useJiraTribeProductOf(organizationId, selectedProductIdFilter);
    let [employeesTribeProduct] = useEmployeesTribeProduct(organizationId, setLimit, selectedProductIdFilter);
    employeesTribeProduct = employeesTribeProduct.filter((empTriProd) => empTriProd.productid === selectedProductIdFilter);

    checkScrollBar(limit, setLimit, loadingScroll);

    function toggle(item) {
        item.showMore = !item.showMore;
        setEmployees(Array.from(employees));
    }
    const members = employees.filter(d => d.roleid === Roles.SE_I).length;    

    // DevOps
    const loadBranch = ({ target: { value } }) => {
        setBranch(value)
    };

    let prodProj = productsProjects.filter(prPj => prPj.productid === selectedProductIdFilter);
    prodProj = [...new Set(prodProj)];
    let projectsForProduct = [];

    for(let pr of prodProj) {
        for(let proj of projects) {
            if(proj.project.id === pr.projectid) {
                projectsForProduct.push(proj);
            }
        }
    }
    let executions = projectsForProduct;

    let productEmployees = [];

    for(let emp of employees) {
        for(let emplProd of employeesTribeProduct) {
            if(emplProd.employeeid === emp.employeeid) {
                productEmployees.push(emp);
            }
        }
    }

    let jiraTribeProductsFiltered = [];

    for(let jiraProjFiltered of jiraTribeProducts) {
        for(let prjWork of projectsWork) {
            if(parseInt(prjWork.id) === jiraProjFiltered.workprojectid) {
                jiraTribeProductsFiltered.push(prjWork)
            }
        }
    }

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
    const handleClick = () => {
        setOpen(true);
      };
      const [open, setOpen] = React.useState(false);

    return <Container>
        <form noValidate autoComplete="off">
            <FormControl className={classes.formControl}>
                <InputLabel>Product</InputLabel>
                <Select
                    value={selectedProductIdFilter}
                    onChange={({ target: { value: productId } }) => setProductFilter(productId === 'none' ? productId : parseInt(productId))}
                >
                    <MenuItem value="none">None</MenuItem>
                    {
                        products.map(product =>
                            <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </form>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4} lg={4} container>
                {
                    products.filter(p => p.id === selectedProductIdFilter).map(product => {
                        return <Paper  key={`product-${product.id}`} style={{ width: '100%', padding: "0 20 20 20"}} elevation={3}>
                            <h2>Team <small>({productEmployees.length} members)</small></h2>
                            {getSummaryLinesOf(product.id, productEmployees, showOnlyWithProblems, toggle, projectFilter)}
                        </Paper>;
                    })
                }
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} container>
                <Paper style={{ width: '100%', padding: "0 20 20 20"}} elevation={3}>
                    <h2>Work</h2>
                    <ComboBox label="Projects" options={jiraTribeProductsFiltered} value={selectedProject} style={{ float: 'right'}} onChange={(newProject) => {
                        setIssues(null);
                        setSelectedProject(newProject);
                    }} />
                    {!issues && selectedProject && <CircularProgress style={{ display: 'block', margin: '30 auto'}} />}
                    {issues && <React.Fragment>
                        <FormControl style={{ width: 300, marginLeft: 20 }}>
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
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper style={{ width: '100%', padding: "5 20 20 20"}} elevation={3}>
                    <h2>Statistics</h2>
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
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper style={{ width: '100%', padding: "5 20 20 20"}} elevation={3}>
                    <h2>Repositories</h2>
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
                                {projectsOfGroupType.length ?
                                    <h3>{name} ({`${projectsOfGroupType.length} projects, ${erroneousProjectsCount} with errors`})<ExternalLinkIcon src={GROUP_PERMISSION_ICON} href={`${GITLAB_URL}/groups/${gitlabGroupPath}/-/group_members`} /></h3> : ''}
                                {
                                    projectsOfGroupType.map(({ project, executions: projectExecutions }) => {
                                        return <Pipeline key={project.id + Math.floor(Math.random() * 9999)} project={project} executions={projectExecutions} branch={branch} fromComp='products' />
                                    })
                                }
                            </div>
                        }
                        )
                    }
                </Paper>
            </Grid>
        </Grid>
    </Container>;
}

// Employees

function getSummaryLinesOf(teamId, employees, showOnlyWithProblems, toggle, projectFilter) {
    employees.sort((a, b) => (a.roleid > b.roleid) ? -1 : (a.roleid === b.roleid) ? ((a.roleid > b.roleid) ? -1 : 1) : 1)
    return employees.filter(d => showOnlyWithProblems ? shouldShowAlarmFor(d) : true).map(d => {
        const healthColor = shouldShowAlarmFor(d) ? 'red' : 'green';
        const developerProjects = [];
        const { tag, theme } = BADGES_ROLES[d.roleid];
        const badgeIcon = <Badge badgeContent={tag} color={theme}><Face /></Badge>;
        const CollapseIcon = d.showMore ? Remove : Add;
        const userProfileLink = <React.Fragment>
            <ExternalLink href={d.activity}>{`${d.name} ${d.surname}`}</ExternalLink>
            <CollapseIcon fontSize="small" onClick={() => toggle(d)}></CollapseIcon>
        </React.Fragment>;
        return <div key={`team-${teamId}-user-${d.username}`} style={{ width: '100%' }}>
            <div style={{ display: 'flex-inline', flexDirection: 'row', alignItems: 'center' }}>
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
