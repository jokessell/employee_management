// src/components/NavigationBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NavigationBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Employee Project Management
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Employees
                </Button>
                <Button color="inherit" component={Link} to="/projects">
                    Projects
                </Button>
                <Button color="inherit" component={Link} to="/generated-data">
                    AI Data
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavigationBar;
