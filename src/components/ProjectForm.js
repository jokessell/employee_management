// src/components/ProjectForm.js
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../api/axiosConfig';

function ProjectForm({ open, handleClose, project, setSnackbarOpen, setSnackbarMessage }) {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Fetch employees to populate the dropdown
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get('/employees');
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    const validationSchema = Yup.object({
        projectName: Yup.string()
            .required('Project name is required')
            .max(255, 'Project name cannot exceed 255 characters'),
        description: Yup.string()
            .max(1024, 'Description cannot exceed 1024 characters'),
        employeeId: Yup.number()
            .required('Employee association is required'),
    });

    const formik = useFormik({
        initialValues: {
            projectId: project ? project.projectId : null,
            projectName: project ? project.projectName : '',
            description: project ? project.description : '',
            employeeId: project ? project.employeeId : '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (project) {
                    // Update existing project
                    await axiosInstance.put(`/projects/${project.projectId}`, values);
                    setSnackbarMessage('Project updated successfully');
                } else {
                    // Create new project
                    await axiosInstance.post('/projects', values);
                    setSnackbarMessage('Project created successfully');
                }
                setSnackbarOpen(true);
                handleClose();
            } catch (error) {
                console.error('Error submitting project form:', error);
                setSnackbarMessage('Failed to submit project form');
                setSnackbarOpen(true);
            }
        }
    });

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogContent>
                {formik.errors.general && (
                    <Typography color="error">{formik.errors.general}</Typography>
                )}
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        margin="dense"
                        label="Project Name"
                        name="projectName"
                        fullWidth
                        value={formik.values.projectName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.projectName && Boolean(formik.errors.projectName)}
                        helperText={formik.touched.projectName && formik.errors.projectName}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        rows={4}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                    <TextField
                        margin="dense"
                        label="Assign to Employee"
                        name="employeeId"
                        select
                        fullWidth
                        value={formik.values.employeeId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.employeeId && Boolean(formik.errors.employeeId)}
                        helperText={formik.touched.employeeId && formik.errors.employeeId}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {employees.map(emp => (
                            <MenuItem key={emp.employeeId} value={emp.employeeId}>
                                {emp.name}
                            </MenuItem>
                        ))}
                    </TextField>
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
                    {project ? 'Update' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProjectForm;
