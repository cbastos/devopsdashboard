import './SoftwareProductionSystem.css';
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Sidebar from './SideBar/Sidebar';
import People from './People/People';
import Products from './Products/Products';
import DevOps from './DevOps/DevOps';
import Work from './Work/Work';
import Login from './Auth/Login';
import Settings from './Settings/Settings';
import ErrorPage from './ErrorPage/ErrorPage';
import PrivateRoute from './Auth/PrivateRoute';

export default () => {
    return <Router>
        <Switch>
            <Route path="/" exact> <Redirect to="/login" /></Route>
            <Route path="/login" component={Login} />
            <Route path="/error" component={withBar(ErrorPage)} />
            <PrivateRoute path="/home"><RedirectToFirstEmployees /></PrivateRoute>
            <PrivateRoute path="/organizations/:organizationid/work" component={withBar(Work)} />
            <PrivateRoute path="/organizations/:organizationid/products" component={withBar(Products)} />
            <PrivateRoute path="/organizations/:organizationid/devops" component={withBar(DevOps)} />
            <PrivateRoute path="/organizations/:organizationid/people" component={withBar(People)} />
            <PrivateRoute roles={['DashboardsAdmin']} path="/organizations/:organizationid/settings" component={withBar(Settings)} />
            <PrivateRoute path="/organizations/:organizationid/error" component={withBar(ErrorPage)} />
            <PrivateRoute path="/organizations/:organizationid/*" component={NotFoundPage} />
            <PrivateRoute path="*" component={IncorrectPage} />
        </Switch>
    </Router>;
};

function RedirectToFirstEmployees() {
    return <Redirect to={`/organizations/0/people`} />;
}

function NotFoundPage() {
    return <Redirect to={{ pathname: 'error', error: '404' }} />;
}

function IncorrectPage() {
    return <Redirect to={{ pathname: 'error', error: '400' }} />;
}

const withBar = (View) => () => <Fragment>
    <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
    <View />
</Fragment>;