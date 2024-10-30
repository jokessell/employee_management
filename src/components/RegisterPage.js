// src/components/RegisterPage.js
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Snackbar
} from '@mui/material';
// Removed unused AuthContext import
// import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';
import { Link } from 'react-router-dom';

function RegisterPage() {
    // Removed unused setAuthData
    // const { setAuthData } = useContext(AuthContext);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .max(50, 'Username cannot exceed 50 characters')
                .required('Username is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const payload = {
                    username: values.username,
                    password: values.password,
                };
                // Removed capturing response since it's unused
                await axiosInstance.post('/auth/register', payload);
                setSnackbarMessage('Registration successful! Please login.');
                setSnackbarOpen(true);
                // Redirect to login page after successful registration
                window.location.href = '/login';
            } catch (error) {
                console.error('Registration error:', error);
                const errorMsg = error.response?.data?.message || 'Registration failed.';
                setSnackbarMessage(errorMsg);
                setSnackbarOpen(true);
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label="Username"
                        margin="normal"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        margin="normal"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <TextField
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        margin="normal"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 3, mb: 2 }}>
                        Register
                    </Button>
                    <Button
                        color="secondary"
                        variant="text"
                        fullWidth
                        component={Link}
                        to="/login"
                    >
                        Already have an account? Login
                    </Button>
                </Box>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Container>
    );
}

export default RegisterPage;
