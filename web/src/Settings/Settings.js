import React, { useState, useEffect } from 'react';
import { fetchApiJson } from '../_shared/fetchJson';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box, Card, CardHeader, Grid, IconButton, Tabs, Tab, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import HelpIcon from '@material-ui/icons/Help';
import { TabPanel } from '../_shared/TabPanel';
import { REDIS_ICON, MYSQL_ICON, NODEJS_ICON } from '../_shared/config';

function useStats() {
    const [stats, setStats] = useState({});
    useEffect(() => {
        setStats({});
        fetchApiJson(`/stats`).then((stats) => {
            setStats(stats);
        }).catch((e) =>{
            setStats(null);
        });
    }, []);
    return [stats, setStats];
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: `calc(100% - 70px)`,
    },
    tabs: { borderRight: `1px solid ${theme.palette.divider}`, height: '100%' },
    checkButton: {background: '#7cc77c', color: '#fff', width: 30, height: 30, top:13, right: 10 },
    fireButton: {background: '#c35c5c', color: '#fff', width: 30, height: 30, top:13, right: 10 }
}));

export default function Settings() {
    const [selectedSettingsTab, setSelectedSettingsTab] = useState(0);
    const classes = useStyles();
    const [stats, setStats] = useStats();

    return <div className={classes.root}>
        <Tabs
            value={selectedSettingsTab}
            indicatorColor="primary"
            textColor="primary"
            orientation="vertical"
            onChange={(...[, newTab]) => { setSelectedSettingsTab(newTab); }}
            className={classes.tabs}
        >
            <Tab label="Health checks" />
            <Tab label="Other" />
        </Tabs>

        <TabPanel value={selectedSettingsTab} index={0} >
            <Typography variant="h6">HEALTH CHECKS</Typography>            
            <br/> 
            <Grid container spacing={1}>
                <Grid item xs={7}>
                    <Box>
                        <Card>
                            <CardHeader 
                                avatar={ <Avatar  variant="rounded"><img src={NODEJS_ICON} width="40" alt="" /></Avatar> }
                                action={  
                                        (!stats && <IconButton className={classes.fireButton}><WhatshotIcon/></IconButton>) 
                                        ||
                                        ((stats && !stats.nodejs) && <IconButton className={classes.fireButton}><WhatshotIcon/></IconButton>) 
                                        ||
                                        ((stats && stats.nodejs) && <IconButton className={classes.checkButton}><CheckIcon/></IconButton>)
                                }
                                title="NodeJS API"
                                subheader="Checks if API implemented in NodeJS, is available"
                            />
                        </Card>
                    </Box>
                </Grid>
                <Grid item xs={7}>
                    <Box>
                        <Card>
                            <CardHeader                                 
                                avatar={ <Avatar  variant="rounded"><img src={MYSQL_ICON} width="45" alt="" /></Avatar> }
                                action={ 
                                    (!stats && <IconButton><HelpIcon/></IconButton>) 
                                    ||                                   
                                    ((stats && !stats.mysql) && <IconButton className={classes.fireButton}><WhatshotIcon/></IconButton>) 
                                    ||
                                    ((stats && stats.mysql) && <IconButton className={classes.checkButton}><CheckIcon/></IconButton>)
                                }
                                title="MySQL DB"
                                subheader="Checks if DATABASE implemented with MySQL, is available"
                            />
                        </Card>
                    </Box>
                </Grid>

                <Grid item xs={7}>
                    <Box>
                        <Card>
                            <CardHeader
                                avatar={ <Avatar  variant="rounded"><img src={REDIS_ICON} width="45" alt="" /></Avatar> }
                                action={  
                                    (!stats && <IconButton><HelpIcon/></IconButton>) 
                                    ||                                  
                                    ((stats && !stats.redis) && <IconButton className={classes.fireButton}><WhatshotIcon/></IconButton>) 
                                    ||
                                    ((stats && stats.redis) && <IconButton className={classes.checkButton}><CheckIcon/></IconButton>)
                                }
                                title="Redis CACHE"
                                subheader="Checks if CACHE implemented with Redis, is available"
                            />
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </TabPanel>

        <TabPanel value={selectedSettingsTab} index={1}>
            <Typography variant="h6">OTHER SETTINGS</Typography>        
        </TabPanel>
    </div>;    
}
