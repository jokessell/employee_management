import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Slide, Typography, MenuItem
} from '@mui/material';
import axiosInstance from '../api/axiosConfig';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function EmployeeForm({ open, handleClose, employee, setSnackbarOpen, setSnackbarMessage }) {
    const [error, setError] = useState(null);

    // Define validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        dateOfBirth: Yup.date().required('Date of Birth is required'),
        avatarUrl: Yup.string().url('Invalid URL format'),
        jobRole: Yup.string().required('Job Role is required'),
        gender: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            employeeId: employee ? employee.employeeId : null,
            name: employee ? employee.name : '',
            email: employee ? employee.email : '', // Ensure email field is included
            dateOfBirth: employee ? employee.dateOfBirth : '',
            avatarUrl: employee ? employee.avatarUrl : '',
            jobRole: employee ? employee.jobRole : '',
            gender: employee ? employee.gender : '',
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
                    setSnackbarMessage('Employee added successfully');
                }
                setSnackbarOpen(true);
                handleClose();
            } catch (error) {
                setError('An error occurred while submitting the form.');
                console.error('Error submitting form:', error);
            }
        },
    });

    // Example useEffect usage
    useEffect(() => {
        if (employee) {
            // Perform any side effects when editing an employee
            console.log(`Editing employee: ${employee.name}`);
        } else {
            // Perform any side effects when adding a new employee
            console.log('Adding a new employee');
        }
    }, [employee]);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <DialogContent>
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        fullWidth
                        variant="outlined"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        autoFocus
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        margin="dense"
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={formik.values.dateOfBirth}
                        onChange={formik.handleChange}
                        error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                        helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Avatar URL"
                        name="avatarUrl"
                        fullWidth
                        variant="outlined"
                        value={formik.values.avatarUrl}
                        onChange={formik.handleChange}
                        error={formik.touched.avatarUrl && Boolean(formik.errors.avatarUrl)}
                        helperText={formik.touched.avatarUrl && formik.errors.avatarUrl}
                    />
                    <TextField
                        margin="dense"
                        label="Job Role"
                        name="jobRole"
                        fullWidth
                        variant="outlined"
                        value={formik.values.jobRole}
                        onChange={formik.handleChange}
                        error={formik.touched.jobRole && Boolean(formik.errors.jobRole)}
                        helperText={formik.touched.jobRole && formik.errors.jobRole}
                    />
                    <TextField
                        margin="dense"
                        label="Gender"
                        name="gender"
                        select
                        fullWidth
                        variant="outlined"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        error={formik.touched.gender && Boolean(formik.errors.gender)}
                        helperText={formik.touched.gender && formik.errors.gender}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {employee ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EmployeeForm;
