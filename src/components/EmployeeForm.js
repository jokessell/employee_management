// src/components/EmployeeForm.js

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Typography, Avatar
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../api/axiosConfig';
import useStyles from '../styles/tableStyles'; // Import shared styles

function EmployeeForm({ open, handleClose, employee, setSnackbarOpen, setSnackbarMessage }) {
    const classes = useStyles(); // Initialize styles

    // State for form fields
    const [avatarPreview, setAvatarPreview] = useState('');

    useEffect(() => {
        if (employee && employee.avatarUrl) {
            setAvatarPreview(employee.avatarUrl);
        } else {
            setAvatarPreview('');
        }
    }, [employee]);

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .max(255, 'Name cannot exceed 255 characters'),
        dateOfBirth: Yup.date()
            .required('Date of Birth is required'),
        avatarUrl: Yup.string()
            .url('Invalid URL format')
            .nullable(),
        jobRole: Yup.string()
            .required('Job Role is required')
            .max(255, 'Job Role cannot exceed 255 characters'),
        gender: Yup.string()
            .required('Gender is required'),
        age: Yup.number()
            .required('Age is required')
            .min(18, 'Age must be at least 18')
            .max(100, 'Age must be less than or equal to 100'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            employeeId: employee ? employee.employeeId : null,
            name: employee ? employee.name : '',
            dateOfBirth: employee ? employee.dateOfBirth : '',
            avatarUrl: employee ? employee.avatarUrl : '',
            jobRole: employee ? employee.jobRole : '',
            gender: employee ? employee.gender : '',
            age: employee ? employee.age : '',
            email: employee ? employee.email : '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (employee) {
                    // Update existing employee
                    await axiosInstance.put(`/employees/${employee.employeeId}`, values);
                    setSnackbarMessage('Employee updated successfully');
                } else {
                    // Create new employee
                    await axiosInstance.post('/employees', values);
                    setSnackbarMessage('Employee created successfully');
                }
                setSnackbarOpen(true);
                handleClose();
            } catch (error) {
                console.error('Error submitting employee form:', error);
                setSnackbarMessage('Failed to submit employee form');
                setSnackbarOpen(true);
            }
        }
    });

    // Handler for avatar URL changes to preview the image
    const handleAvatarChange = (e) => {
        const url = e.target.value;
        formik.handleChange(e);
        if (url) {
            setAvatarPreview(url);
        } else {
            setAvatarPreview('');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <DialogContent>
                {formik.errors.general && (
                    <Typography color="error">{formik.errors.general}</Typography>
                )}
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        fullWidth
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        margin="dense"
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formik.values.dateOfBirth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                        helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                    />
                    <TextField
                        margin="dense"
                        label="Avatar URL"
                        name="avatarUrl"
                        fullWidth
                        value={formik.values.avatarUrl}
                        onChange={handleAvatarChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.avatarUrl && Boolean(formik.errors.avatarUrl)}
                        helperText={formik.touched.avatarUrl && formik.errors.avatarUrl}
                    />
                    {avatarPreview && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <Avatar src={avatarPreview} alt="Avatar Preview" className={classes.avatar} />
                        </div>
                    )}
                    <TextField
                        margin="dense"
                        label="Job Role"
                        name="jobRole"
                        fullWidth
                        value={formik.values.jobRole}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.jobRole && Boolean(formik.errors.jobRole)}
                        helperText={formik.touched.jobRole && formik.errors.jobRole}
                    />
                    <TextField
                        margin="dense"
                        label="Gender"
                        name="gender"
                        select
                        fullWidth
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.gender && Boolean(formik.errors.gender)}
                        helperText={formik.touched.gender && formik.errors.gender}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Non-binary">Non-binary</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Age"
                        name="age"
                        type="number"
                        fullWidth
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.age && Boolean(formik.errors.age)}
                        helperText={formik.touched.age && formik.errors.age}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={formik.handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!(formik.isValid && formik.dirty)}
                >
                    {employee ? 'Update' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EmployeeForm;
