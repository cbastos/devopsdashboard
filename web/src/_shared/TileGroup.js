import React from 'react';
import { Grid, Box } from '@material-ui/core';

export default function TileGroup({spacing, children, id }) {
    return <Box mb={3} id={id}>
            <Grid container spacing={spacing}>{children}</Grid>
        </Box>;
}