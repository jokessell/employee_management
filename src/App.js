import React from 'react';
import EmployeeTable from './components/EmployeeTable';
import { Container, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme (optional)
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Customize as needed
        },
        secondary: {
            main: '#dc004e', // Customize as needed
        },
    },
    // Add more theme customizations if necessary
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Normalize styles across browsers */}
            <Container>
                <Typography variant="h3" align="center" gutterBottom>
                    Employee Management System
                </Typography>
                <EmployeeTable />
            </Container>
        </ThemeProvider>
    );
}

export default App;
