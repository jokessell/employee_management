import React, { useContext } from 'react';
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
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';

function LoginPage() {
    const { auth, setAuthData, logout } = useContext(AuthContext);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    // Formik setup for login form
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axiosInstance.post('/auth/login', values);
                const token = response.data.token;
                setAuthData(token);
                setSnackbarMessage('Login successful!');
                setSnackbarOpen(true);
                window.location.href = '/employees';
            } catch (error) {
                console.error('Login error:', error);
                setSnackbarMessage('Login failed. Please check your credentials.');
                setSnackbarOpen(true);
            }
        },
    });

    // Render login form if user is not logged in, else show logout button
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    {auth.token ? 'Welcome Back!' : 'Login'}
                </Typography>
                {auth.token ? (
                    <Box sx={{ mt: 3 }}>
                        <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                logout();
                                setSnackbarMessage('Logged out successfully.');
                                setSnackbarOpen(true);
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            id="username"
                            name="username"
                            label="Username"
                            margin="normal"
                            value={formik.values.username}
                            onChange={formik.handleChange}
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
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 3, mb: 2 }}>
                            Login
                        </Button>
                        <Button
                            color="secondary"
                            variant="text"
                            fullWidth
                            onClick={() => window.location.href = '/register'}
                        >
                            Don't have an account? Register
                        </Button>
                    </Box>
                )}
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

export default LoginPage;
