import './Pipeline.css';
import React, { Fragment } from 'react';
import {
    GITLAB_URL, NPM_PACKAGE_ICON, DOCS_ICON,
    BUILD_HEALTH_COLORS as HEALTH_COLORS, CODE_QUALITY_ICON, BUILD_ICON, CODEBASE_ICON,
    GITLAB_CONFIG, ARTIFACTORY_PACKAGES_URL, RED, RIGHT_ARROW_ICON, TEAM_ICON, INT_ENV_ICON, 
    JENKINS_URL, JENKINS_LEGACY_URL, JIRA_ICON, CONFLUENCE_URL
} from '../_shared/config';
import { Switch, Route, NavLink, useParams } from "react-router-dom";
import { DEVOPS_PATH } from '../_shared/config';
import { Jenkins } from './Jenkins/Jenkins';
import Environment from './Environment/Environment';
import Repository from './Repository/Repository';
import CodeQualitySummary from './CodeQualitySummary/CodeQualitySummary';
import Icon from '../_shared/Icon';
import ExternalLinkIcon from '../_shared/ExternalLinkIcon';
import ToggleRouteLinkIcon from './_shared/ToggleRouteLinkIcon';
import ProjectAnalizer from './_shared/projectAnalizer';

const projectAnalyzer = new ProjectAnalizer();

export default function Pipeline({ project, executions, branch, fromComp }) {
    const allErrors = projectAnalyzer.getErrorsOf(project, executions);
    const jenkinsErrors = allErrors.filter((error) => error.type === 'jenkins');
    const sonarqubeErrors = allErrors.filter((error) => error.type === 'sonarqube');
    const confluenceErrors = allErrors.filter((error) => error.type === 'confluence');
    const artifactoryErrors = allErrors.filter((error) => error.type === 'artifactory');
    const healthColor = getColorFor(allErrors);
    const { organizationid } = useParams();
    const JENKINS_HOST = project.jenkins.group  === "componenteslegacy" ? JENKINS_LEGACY_URL: JENKINS_URL;
    const componentPath = fromComp ? fromComp : DEVOPS_PATH;
    return <div key={`${project.type}-${project.name}`}>
        <div className="pipeline">
            <div className={`health ${healthColor}`}></div>
            <span title={getParagraphOf(allErrors)} style={{ width: '300px', margin: '0 5px' }}>
                {project.name}
            </span>
            <NavLink activeClassName='is-active' to={`/organizations/${organizationid}/people?projectId=${project.id}`}>
                <Icon src={TEAM_ICON}></Icon>
            </NavLink>
            <Icon src={RIGHT_ARROW_ICON}></Icon>
            <StateBorder errors={confluenceErrors}>
                <ExternalLinkIcon src={DOCS_ICON} href={`${CONFLUENCE_URL}/display/${project.confluence.space}/${project.confluence.page}`}></ExternalLinkIcon>
            </StateBorder>
            <Icon src={RIGHT_ARROW_ICON}></Icon>
            <StateBorder errors={[]}>
                <ToggleRouteLinkIcon to={`/organizations/${organizationid}/${componentPath}/${project.id}/repository`} src={CODEBASE_ICON}></ToggleRouteLinkIcon>
            </StateBorder>
            <Icon src={RIGHT_ARROW_ICON}></Icon>
            {project.config && <Fragment><ExternalLinkIcon src={GITLAB_CONFIG} href={`${GITLAB_URL}/projects/${project.config}`}></ExternalLinkIcon> <Icon src={RIGHT_ARROW_ICON}></Icon></Fragment>}
            <StateBorder errors={jenkinsErrors}>
                <ToggleRouteLinkIcon to={`/organizations/${organizationid}/${componentPath}/${project.id}/jenkins`} src={BUILD_ICON}></ToggleRouteLinkIcon>
            </StateBorder>
            <Icon src={RIGHT_ARROW_ICON}></Icon>
            <StateBorder errors={sonarqubeErrors}>
                <ToggleRouteLinkIcon to={`/organizations/${organizationid}/${componentPath}/${project.id}/quality-summary`} src={CODE_QUALITY_ICON}></ToggleRouteLinkIcon>
            </StateBorder>
            <Icon src={RIGHT_ARROW_ICON}></Icon>
            <StateBorder errors={artifactoryErrors}>
                <ExternalLinkIcon src={NPM_PACKAGE_ICON} href={`${ARTIFACTORY_PACKAGES_URL}/${project.repositorypackageid}`}></ExternalLinkIcon>
            </StateBorder>
            {project.projecttypeid != 2 && <React.Fragment>         
                <Icon src={RIGHT_ARROW_ICON}></Icon>
                <ToggleRouteLinkIcon to={`/organizations/${organizationid}/${componentPath}/${project.id}/deployments`} src={'/deployments.png'}></ToggleRouteLinkIcon>
            </React.Fragment> }
        </div>
        <Switch>
            <SummaryRoute path={`/organizations/${organizationid}/${componentPath}/${project.id}/repository`}>
                <Repository id={project.coderepositoryid} commits={project.commits} branch={branch} merges={project.merges && project.merges.merges ? project.merges.merges : {}} />
            </SummaryRoute>
            <SummaryRoute path={`/organizations/${organizationid}/${componentPath}/${project.id}/jenkins`}>
                <Jenkins projectId={project.coderepositoryid} commits={project.commits} project={project.jenkins.name} url={`${JENKINS_HOST}/job/${project.jenkins.group}/job/${project.jenkins.name}`} executions={executions} color={getColorFor(jenkinsErrors)} />
            </SummaryRoute>
            <SummaryRoute path={`/organizations/${organizationid}/${componentPath}/${project.id}/quality-summary`}>
                <CodeQualitySummary sonarqubeProjectName={project.codeanalyzerprojectid} sonarqubeMeasures={project.sonarqubeMeasures} executions={executions}></CodeQualitySummary>
            </SummaryRoute>
            <SummaryRoute path={`/organizations/${organizationid}/${componentPath}/${project.id}/deployments`}>
                <Environment type={project.projecttypeid} projectId={project.id}  gitlabProjectId={project.coderepositoryid} branch={branch} />
            </SummaryRoute>
        </Switch>
    </div>;
}

function getParagraphOf(errorsByType) {
    return errorsByType.map(({ type, name, errors }) => `${type} (${name}): ${errors.join()}`).join('\n');
}

function getColorFor(errors) {
    return errors.length > 0 ? HEALTH_COLORS.failed : HEALTH_COLORS.success;
}

function StateBorder({ errors, children }) {
    const hasErrors = errors.length > 0;
    return <div title={getParagraphOf(errors)} style={{ border: `2px solid ${hasErrors ? RED : 'white'}` }}>
        {children}
    </div>
}

function SummaryRoute({ path, children }) {
    return <Route exact path={path}>
        <fieldset>
            {children}
        </fieldset>
    </Route>;
}
