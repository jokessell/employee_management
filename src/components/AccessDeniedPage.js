// src/components/AccessDeniedPage.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const AccessDeniedPage = () => {
    return (
        <Container sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Access Denied
            </Typography>
            <Typography variant="body1" gutterBottom>
                You do not have permission to view this page.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                Go to Home
            </Button>
        </Container>
    );
};

export default AccessDeniedPage;
