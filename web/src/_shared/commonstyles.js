export default function commonStyles(theme) {
    return {
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            '& .MuiListItemText-root': {
                margin: 0,
            },
            '& .MuiListItemText-root > .MuiTypography-root': {
                lineHeight: 1
            }
        },
        formControlTextField: {
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
            '& .MuiFilledInput-root': {
                backgroundColor: 'rgb(0,0,0,0)',
            }
        }
    }
}