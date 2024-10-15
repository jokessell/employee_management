// src/components/ProjectForm.js

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography, Autocomplete
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAllSkills } from '../api/skillApi';
import { getAllEmployees } from '../api/employeeApi'; // Ensure this function exists
import axiosInstance from '../api/axiosConfig';
import useStyles from '../styles/tableStyles'; // Import shared styles

function ProjectForm({ open, handleClose, project, setSnackbarOpen, setSnackbarMessage }) {
    const classes = useStyles(); // Initialize styles

    const [employees, setEmployees] = useState([]);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        // Fetch employees and skills to populate the multi-selects
        const fetchData = async () => {
            try {
                const employeesResponse = await axiosInstance.get('/employees');
                setEmployees(employeesResponse.data);

                const skillsResponse = await getAllSkills();
                setSkills(skillsResponse.data);
            } catch (error) {
                console.error('Error fetching data for ProjectForm:', error);
                setSnackbarMessage('Failed to fetch data for Project Form.');
                setSnackbarOpen(true);
            }
        };
        fetchData();
    }, [setSnackbarMessage, setSnackbarOpen]);

    const validationSchema = Yup.object({
        projectName: Yup.string()
            .required('Project name is required')
            .max(255, 'Project name cannot exceed 255 characters'),
        description: Yup.string()
            .max(1024, 'Description cannot exceed 1024 characters'),
        employees: Yup.array()
            .min(1, 'At least one employee must be assigned')
            .of(
                Yup.object().shape({
                    employeeId: Yup.number().required(),
                    name: Yup.string().required(),
                })
            ),
        skills: Yup.array()
            .min(1, 'At least one skill is required')
            .of(
                Yup.object().shape({
                    skillId: Yup.number().required(),
                    name: Yup.string().required(),
                })
            ),
    });

    const formik = useFormik({
        initialValues: {
            projectId: project ? project.projectId : null,
            projectName: project ? project.projectName : '',
            description: project ? project.description : '',
            employees: project
                ? project.employees.map(emp => ({
                    employeeId: emp.employeeId,
                    name: emp.name,
                }))
                : [],
            skills: project
                ? project.skills.map(skill => ({
                    skillId: skill.skillId,
                    name: skill.name,
                }))
                : [],
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const payload = {
                    projectName: values.projectName,
                    description: values.description,
                    employeeIds: values.employees.map(emp => emp.employeeId),
                    skillIds: values.skills.map(skill => skill.skillId),
                };

                if (project) {
                    // Update existing project
                    await axiosInstance.put(`/projects/${project.projectId}`, payload);
                    setSnackbarMessage('Project updated successfully');
                } else {
                    // Create new project
                    await axiosInstance.post('/projects', payload);
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
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
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
                        className={classes.formField} // Use classes if defined
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
                        className={classes.formField} // Use classes if defined
                    />
                    {/* Autocomplete for Employees */}
                    <Autocomplete
                        multiple
                        id="employees"
                        options={employees}
                        getOptionLabel={(option) => `${option.employeeId} - ${option.name}`}
                        value={formik.values.employees}
                        onChange={(event, newValue) => {
                            formik.setFieldValue('employees', newValue);
                        }}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Assign Employees"
                                margin="dense"
                                error={formik.touched.employees && Boolean(formik.errors.employees)}
                                helperText={formik.touched.employees && formik.errors.employees}
                                className={classes.formField} // Use classes if defined
                            />
                        )}
                    />
                    {/* Autocomplete for Skills */}
                    <Autocomplete
                        multiple
                        id="skills"
                        options={skills}
                        getOptionLabel={(option) => option.name}
                        value={formik.values.skills}
                        onChange={(event, newValue) => {
                            formik.setFieldValue('skills', newValue);
                        }}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Required Skills"
                                margin="dense"
                                error={formik.touched.skills && Boolean(formik.errors.skills)}
                                helperText={formik.touched.skills && formik.errors.skills}
                                className={classes.formField} // Use classes if defined
                            />
                        )}
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
                    {project ? 'Update' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProjectForm;
