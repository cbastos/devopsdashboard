import React from 'react';
import { TILE_THEMES_COLORS, TILE_THEMES } from './config';
import { Tooltip, Grid, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({ 
    card: {
        flexGrow: 1
    },
    textTitle: {
        fontSize: 14,
        color: '#999'
    },
    ul: {
        fontSize: 14
    }
}));

export function Tile({ theme=TILE_THEMES.NEUTRAL, text="Titulo", title="", xs=12, sm, md, lg, children }) {
    const { background, color } = TILE_THEMES_COLORS[theme];
    const classes = useStyles();

    return <Grid item xs={xs} sm={sm} md={md} lg={lg}>
        <Tooltip title={title}>
            <Card className={classes.card} style={{ backgroundColor: background, color: color }}>
                <CardContent>
                    <Typography className={classes.textTitle} align="center" >{text}</Typography>
                    {children}
                </CardContent>
            </Card>
        </Tooltip>
    </Grid>;
}
