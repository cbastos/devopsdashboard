import React from 'react';
import { Typography, Container, Button } from '@material-ui/core';
import { useLocation, useHistory } from "react-router-dom";

export default () => {  
    const error = useLocation().error;
    const prevPage = '/home';
    const history = useHistory();

    let title="";
    let message="";

    switch (error) {
        case "400":
            title = 'Oops! Page Not Correct';
            message = 'We are sorry, but requested page is not correct';
            break;
        case "403":            
            title = 'Oops! Page Forbidden';
            message = 'We are sorry, but you dont have privilegies to access requested page';
            break;
        case "404":
            title = 'Oops! Page Not Found';
            message = 'We are sorry, but page you requested was not found';
            break;
    }

    return <Container >
            <Typography variant="h1" align="center" style={{fontSize: '200', fontWeight: '100', color: '#1976d2'}}>{error}</Typography>
            <Typography variant="subtitle1" align="center" style={{fontSize: '20', textTransform: 'uppercase'}}>OOPS! {message}</Typography>
            <Button variant="contained" color="secondary" align="center" style={{display: 'block', margin: '15 auto'}} onClick={()=> history.push(prevPage)}>GO TO HOMEPAGE</Button>
        </Container>;
}
