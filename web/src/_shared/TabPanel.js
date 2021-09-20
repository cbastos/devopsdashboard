import React from 'react';
import { Box } from '@material-ui/core';

export function TabPanel({ children, value, index }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            style={{ width: 'calc(100% - 160px)', overflow: 'auto', height: 'calc(100%)' }}
            aria-labelledby={`vertical-tab-${index}`}
        >
            {value === index && <Box p={3}> {children} </Box>}
        </div>
    );
}