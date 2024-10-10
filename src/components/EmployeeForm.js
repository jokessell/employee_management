import React, { useEffect, useState } from 'react';
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

    // Define validation schema with updated rules
    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .test('is-full-name', 'Please enter both first and last name', value => {
                return value && value.trim().split(' ').filter(n => n).length >= 2;
            })
            .matches(/^[A-Za-z]+(?: [A-Za-z]+)+$/, 'Name must contain at least two words with alphabetical characters'),
        dateOfBirth: Yup.date()
            .required('Date of Birth is required')
            .max(new Date(), 'Date of Birth cannot be in the future'),
        avatarUrl: Yup.string()
            .required('Avatar URL is required')
            .url('Invalid URL format'),
        jobRole: Yup.string()
            .required('Job Role is required')
            .test('is-valid-jobrole', 'Job Role must be at least one word with at least 4 alphabetical characters', value => {
                return value && /[A-Za-z]{4,}/.test(value);
            }),
        gender: Yup.string()
            .required('Gender is required')
            .oneOf(['Male', 'Female', 'Non-Binary'], 'Invalid gender selection'),
    });

    const formik = useFormik({
        initialValues: {
            employeeId: employee ? employee.employeeId : null,
            name: employee ? employee.name : '',
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
                    // Create new employee, omit employeeId from values
                    const { employeeId, ...newEmployeeData } = values; // Exclude employeeId from the payload
                    await axiosInstance.post('/employees', newEmployeeData);
                    setSnackbarMessage('Employee added successfully');
                }
                setSnackbarOpen(true);
                handleDialogClose();
            } catch (error) {
                setError('An error occurred while submitting the form.');
                console.error('Error submitting form:', error);
            }
        }
    });

    useEffect(() => {
        if (employee) {
            console.log(`Editing employee: ${employee.name}`);
        } else {
            console.log('Adding a new employee');
        }
    }, [employee]);

    // Reset error when dialog is closed
    const handleDialogClose = () => {
        setError(null);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleDialogClose}
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
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        autoFocus
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
                        onBlur={formik.handleBlur}
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
                        onBlur={formik.handleBlur}
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
                        variant="outlined"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.gender && Boolean(formik.errors.gender)}
                        helperText={formik.touched.gender && formik.errors.gender}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Non-Binary">Non-Binary</MenuItem>
                    </TextField>

                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!(formik.isValid && formik.dirty)}
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
