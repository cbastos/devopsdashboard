
import React from 'react';
import { FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ComboBox({ label, options, value, onChange }) {
    return (
        <FormControl>
            <Autocomplete
                value={value}
                onChange={(e, newValue) => { onChange(newValue) }}
                options={options}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option) => option.name}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
            />
        </FormControl>
    );
}