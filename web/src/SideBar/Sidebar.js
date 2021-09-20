import React, { Fragment } from 'react';
import { BLUE, kc_logout_redirect_url, SIDEBAR_WITH } from '../_shared/config';
import clsx from 'clsx';
import { Drawer, Divider, Box, IconButton, CssBaseline, AppBar, Toolbar, Typography, Menu, MenuItem, ListItem, List, ListSubheader, ListItemText, ListItemIcon } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles, useTheme, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Restore, Group, Assignment, FilterNone } from '@material-ui/icons';
import SettingsIcon from '@material-ui/icons/Settings';
import { AuthorizedElement } from '../Auth/AuthProvider';
import { useAuth } from '../Auth/AuthProvider';
import { NavLink } from 'react-router-dom';
import useOrganizations from '../_shared/useOrganizations';
import useOrganizationIdFromUrl from '../_shared/useOrganizationIdFromUrl';
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => {
  return createStyles({
    root: {
      display: 'flex',
      color: 'white'
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      backgroundColor: BLUE
    },
    appBarShift: {
      width: `calc(100% - ${SIDEBAR_WITH}px)`,
      marginLeft: SIDEBAR_WITH,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(1),
      borderRadius: 0,
      color: 'white',
      textDecoration: 'none'
    },
    selectedMenuButton: {
      marginRight: theme.spacing(1),
      borderRadius: 0,
      borderBottom: '2px solid white'
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: SIDEBAR_WITH,
      flexShrink: 0,
    },
    drawerPaper: {
      width: SIDEBAR_WITH,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -SIDEBAR_WITH,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    title: {
      flexGrow: 1,
    },
    user: {
      flexGrow: 1,
      textAlign: 'right',
    },
    offset: { minHeight: 43 },
    toolbar: {
      flexWrap: 'wrap',
    },
    toolbarTitle: {
      flexGrow: 1,
    },
    buttonsidebar: {
      paddingLeft: 5
    },
  })
});

export default function Sidebar() {
  const auth = useAuth();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();

  const [organizations] = useOrganizations();
  const [organizationId] = useOrganizationIdFromUrl(useParams);
  const selectedOrganizationName = organizations.length ? organizations.find(o => o.id.toString() === organizationId)?.name : '';
  const currentSection = history.location.pathname.split('/')[3] || 'employees';

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openUserMenu = Boolean(anchorEl);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    auth.logout({
      redirectUri: kc_logout_redirect_url
    });
  };

  return <Fragment>
    <CssBaseline />
    <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: open })}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant="h5" className={classes.toolbarTitle}>{selectedOrganizationName}</Typography>

        <NavLink to={`/organizations/${organizationId}/people`} className={classes.menuButton} activeClassName={classes.selectedMenuButton}>
          <IconButton id="people-menu-button" color="inherit">
            <Group />
            <Typography variant="overline" className={classes.buttonsidebar}>People</Typography>
          </IconButton>
        </NavLink>

        <NavLink to={`/organizations/${organizationId}/devops`} className={classes.menuButton} activeClassName={classes.selectedMenuButton}>
          <IconButton id="devops-menu-button" color="inherit">
            <Restore /> <Typography variant="overline" className={classes.buttonsidebar}>DevOps</Typography>
          </IconButton>
        </NavLink>

        <NavLink to={`/organizations/${organizationId}/work`} className={classes.menuButton} activeClassName={classes.selectedMenuButton}>
          <IconButton id="work-menu-button" color="inherit">
            <Assignment /> <Typography variant="overline"  className={classes.buttonsidebar}>Work</Typography>
          </IconButton>
        </NavLink>

        <NavLink to={`/organizations/${organizationId}/products`} className={classes.menuButton} activeClassName={classes.selectedMenuButton}>
          <IconButton id="product-menu-button" color="inherit">
            <FilterNone /> <Typography variant="overline" className={classes.buttonsidebar}>Products</Typography>
          </IconButton>
        </NavLink>

        <AuthorizedElement roles={['DashboardsAdmin']}>
          <NavLink to={`/organizations/${organizationId}/settings`} className={classes.menuButton} activeClassName={classes.selectedMenuButton}>
            <IconButton id="settings-menu-button" color="inherit" >
              <SettingsIcon /> <Typography variant="overline" className={classes.buttonsidebar}>Settings</Typography>
            </IconButton>
          </NavLink>
        </AuthorizedElement>

        <Typography className={classes.user}></Typography>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleUserMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={openUserMenu}
          onClose={handleCloseUserMenu}
        >
          <MenuItem disabled={true}>User: {auth.user ? auth.user.username : ''}</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={<ListSubheader className={classes.subheader} component="div" id="nested-list-subheader">Organizations</ListSubheader>}
        className={classes.list}
      >
        {
          organizations.map(organization =>
            <ListItem button component="a" key={organization.id} className={classes.menuitem} onClick={
              () => {
                setOpen(false);
                history.push(`/organizations/${organization.id}/${currentSection}`);
              }}>
              <ListItemIcon className={classes.menuitemicon}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText>{organization.name}</ListItemText>
            </ListItem>
          )
        }
      </List>
    </Drawer>
    <Box mb={3} className={classes.offset}></Box>
  </Fragment>;
}