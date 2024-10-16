import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Button,
    Typography,
    Autocomplete,
    Stack
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAllSkills } from '../api/skillApi';
import { getAllEmployees } from '../api/employeeApi';
import { createProject, partialUpdateProject } from '../api/projectApi';
import useStyles from '../styles/tableStyles';

function ProjectForm({ open, handleClose, project, setSnackbarOpen, setSnackbarMessage }) {
    const classes = useStyles();

    const [employees, setEmployees] = useState([]);
    const [skills, setSkills] = useState([]);
    const [initialValues, setInitialValues] = useState(null);

    // Fetch employees and skills data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeesResponse = await getAllEmployees({
                    page: 0,
                    size: 1000,
                    sort: 'name,asc',
                });
                setEmployees(employeesResponse.data.content || []);

                const skillsResponse = await getAllSkills({
                    page: 0,
                    size: 1000,
                    sort: 'name,asc',
                });
                setSkills(skillsResponse.data.content || []);
            } catch (error) {
                console.error('Error fetching data for ProjectForm:', error);
                setSnackbarMessage('Failed to fetch data for Project Form.');
                setSnackbarOpen(true);
            }
        };
        fetchData();
    }, [setSnackbarMessage, setSnackbarOpen]);

    // Set initialValues after data and project are available
    useEffect(() => {
        if (employees.length > 0 && skills.length > 0) {
            if (project) {
                const mappedEmployees = employees.filter(e =>
                    project.employeeIds.some(empId => String(empId) === String(e.employeeId))
                );

                const mappedSkills = skills.filter(s =>
                    project.skills.some(skill => String(skill.skillId) === String(s.skillId))
                );

                setInitialValues({
                    projectId: project.projectId,
                    projectName: project.projectName,
                    description: project.description,
                    employees: mappedEmployees,
                    skills: mappedSkills,
                });
            } else {
                setInitialValues({
                    projectId: null,
                    projectName: '',
                    description: '',
                    employees: [],
                    skills: [],
                });
            }
        }
    }, [project, employees, skills]);

    // Define the validation schema
    const validationSchema = Yup.object({
        projectName: Yup.string()
            .max(255, 'Project name cannot exceed 255 characters.')
            .required('Project name is required.'),
        description: Yup.string()
            .max(1024, 'Description cannot exceed 1024 characters.')
            .nullable(),
        employees: Yup.array()
            .of(
                Yup.object().shape({
                    employeeId: Yup.number().required('Employee ID is required.'),
                    name: Yup.string().required('Employee name is required.'),
                })
            )
            .nullable(),
        skills: Yup.array()
            .of(
                Yup.object().shape({
                    skillId: Yup.number().required('Skill ID is required.'),
                    name: Yup.string().required('Skill name is required.'),
                })
            )
            .nullable()
    });

    const formik = useFormik({
        initialValues: initialValues || {
            projectId: null,
            projectName: '',
            description: '',
            employees: [],
            skills: [],
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Initialize payload with required fields
                const payload = {};

                // Include projectName if it's different
                if (values.projectName !== (project?.projectName || '')) {
                    payload.projectName = values.projectName;
                }

                // Include description if it's different
                if (values.description !== (project?.description || '')) {
                    payload.description = values.description;
                }

                // Compare original and current employeeIds
                const originalEmployeeIds = project?.employees?.map(emp => String(emp.employeeId)) || [];
                const currentEmployeeIds = values.employees.map(emp => String(emp.employeeId));
                if (JSON.stringify(originalEmployeeIds) !== JSON.stringify(currentEmployeeIds)) {
                    payload.employeeIds = currentEmployeeIds;
                }

                // Compare original and current skillIds
                const originalSkillIds = project?.skills?.map(skill => String(skill.skillId)) || [];
                const currentSkillIds = values.skills.map(skill => String(skill.skillId));
                if (JSON.stringify(originalSkillIds) !== JSON.stringify(currentSkillIds)) {
                    payload.skillIds = currentSkillIds;
                }

                console.log('Submitting Payload:', payload);

                if (project) {
                    // Use PATCH for partial updates
                    await partialUpdateProject(project.projectId, payload);
                    setSnackbarMessage('Project updated successfully');
                } else {
                    // Create new project
                    await createProject(payload);
                    setSnackbarMessage('Project created successfully');
                }
                setSnackbarOpen(true);
                handleClose();
            } catch (error) {
                console.error('Error submitting project form:', error);
                if (error.response && error.response.data) {
                    // Display validation errors from backend
                    setSnackbarMessage(`Failed: ${JSON.stringify(error.response.data)}`);
                } else {
                    setSnackbarMessage('Failed to submit project form');
                }
                setSnackbarOpen(true);
            } finally {
                setSubmitting(false);
            }
        }
    });

    // Helper function to aggregate error messages for arrays of objects
    const getHelperText = (fieldErrors, fieldName) => {
        if (Array.isArray(fieldErrors)) {
            return fieldErrors.map((error, index) => (
                <span key={index}>
          {error[`${fieldName}Id`] && (
              <div>{`${capitalizeFirstLetter(fieldName)} ID: ${error[`${fieldName}Id`]}`}</div>
          )}
                    {error.name && <div>Name: {error.name}</div>}
        </span>
            ));
        }
        return fieldErrors;
    };

    // Utility function to capitalize the first letter
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Render loading indicator while data is being fetched
    if (!initialValues) {
        return <div>Loading...</div>;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    {formik.errors.general && (
                        <Typography color="error">{formik.errors.general}</Typography>
                    )}
                    <Stack spacing={2} mt={1}>
                        {/* Project Name Field */}
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
                            className={classes.formField}
                        />
                        {/* Description Field */}
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
                            className={classes.formField}
                        />
                        {/* Autocomplete for Employees */}
                        <Autocomplete
                            multiple
                            id="employees"
                            options={employees}
                            getOptionLabel={(option) => `${option.employeeId ?? ''} - ${option.name ?? ''}`}
                            isOptionEqualToValue={(option, value) => String(option.employeeId) === String(value.employeeId)}
                            value={formik.values.employees}
                            onChange={(event, newValue) => {
                                formik.setFieldValue('employees', newValue);
                            }}
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option.name || ''}
                                        {...getTagProps({ index })}
                                        key={option.employeeId}
                                        className={classes.chip}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Assign Employees"
                                    margin="dense"
                                    error={formik.touched.employees && Boolean(formik.errors.employees)}
                                    helperText={
                                        formik.touched.employees && formik.errors.employees
                                            ? typeof formik.errors.employees === 'string'
                                                ? formik.errors.employees
                                                : getHelperText(formik.errors.employees, 'employee')
                                            : ''
                                    }
                                    className={classes.formField}
                                />
                            )}
                        />
                        {/* Autocomplete for Skills */}
                        <Autocomplete
                            multiple
                            id="skills"
                            options={skills}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => String(option.skillId) === String(value.skillId)}
                            value={formik.values.skills}
                            onChange={(event, newValue) => {
                                formik.setFieldValue('skills', newValue);
                            }}
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option.name || ''}
                                        {...getTagProps({ index })}
                                        key={option.skillId}
                                        className={classes.chip}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Required Skills"
                                    margin="dense"
                                    error={formik.touched.skills && Boolean(formik.errors.skills)}
                                    helperText={
                                        formik.touched.skills && formik.errors.skills
                                            ? typeof formik.errors.skills === 'string'
                                                ? formik.errors.skills
                                                : getHelperText(formik.errors.skills, 'skill')
                                            : ''
                                    }
                                    className={classes.formField}
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={!formik.values.projectName || Boolean(formik.errors.projectName)}
                    >
                        {project ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ProjectForm;
