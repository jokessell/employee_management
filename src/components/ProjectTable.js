// src/components/ProjectTable.js

import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Tooltip,
    Snackbar, Typography, CircularProgress,
    TablePagination
} from '@mui/material';
import ProjectForm from './ProjectForm';
import ConfirmDialog from './ConfirmDialog';
import axiosInstance from '../api/axiosConfig';
import useStyles from '../styles/tableStyles'; // Import shared styles

function ProjectTable() {
    const classes = useStyles(); // Initialize styles
    const [projects, setProjects] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [employees, setEmployees] = useState([]);

    // Memoize fetchProjects to prevent unnecessary re-renders
    const fetchProjects = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/projects', {
                params: {
                    page: page,
                    size: rowsPerPage,
                    sort: 'projectName,asc',
                },
            });
            setProjects(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setSnackbarMessage('Failed to fetch projects.');
            setSnackbarOpen(true);
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    // Fetch employees once when the component mounts
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get('/employees');
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
                setSnackbarMessage('Failed to fetch employees.');
                setSnackbarOpen(true);
            }
        };
        fetchEmployees();
    }, []); // Empty dependency array ensures this runs once

    // Fetch projects whenever 'fetchProjects' changes (i.e., when 'page' or 'rowsPerPage' changes)
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Handler for opening the Add Project form
    const handleAdd = () => {
        setSelectedProject(null);
        setOpenForm(true);
    };

    // Handler for editing an existing project
    const handleEdit = (project) => {
        setSelectedProject(project);
        setOpenForm(true);
    };

    // Handler for deleting a project
    const handleDelete = (project) => {
        setProjectToDelete(project);
        setOpenConfirm(true);
    };

    // Handler for closing the Project form modal
    const handleFormClose = () => {
        setOpenForm(false);
        fetchProjects(); // Refresh the project list after closing the form
    };

    // Handler for confirming deletion
    const handleConfirmClose = async (confirm) => {
        if (confirm) {
            try {
                await axiosInstance.delete(`/projects/${projectToDelete.projectId}`);
                setSnackbarMessage('Project deleted successfully.');
                setSnackbarOpen(true);
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
                setSnackbarMessage('Failed to delete project.');
                setSnackbarOpen(true);
            }
        }
        setOpenConfirm(false);
    };

    // Handler for changing the current page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handler for changing the number of rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Loading state for fetching projects
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div style={{ padding: '40px' }}>
            {/* Title */}
            <Typography variant="h4" align="center" gutterBottom>
                Project Management
            </Typography>

            {/* Add Project Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button
                    variant="contained"
                    className={classes.addButton}
                    onClick={handleAdd}
                >
                    Add Project
                </Button>
            </div>

            {/* Projects Table */}
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow className={classes.tableHeader}>
                            <TableCell className={classes.tableCell}><strong>ID</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Project Name</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Description</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Assigned Employee</strong></TableCell>
                            <TableCell align="right" className={classes.tableCell}><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.content.length > 0 ? (
                            projects.content.map((project) => {
                                const employee = employees.find(emp => emp.employeeId === project.employeeId);
                                return (
                                    <TableRow key={project.projectId} className={classes.tableRow}>
                                        <TableCell className={classes.tableCell}>{project.projectId}</TableCell>
                                        <TableCell className={classes.tableCell}>{project.projectName}</TableCell>
                                        <TableCell className={classes.tableCell}>{project.description}</TableCell>
                                        <TableCell className={classes.tableCell}>{employee ? employee.name : 'Unassigned'}</TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            <Tooltip title="Edit Project">
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleEdit(project)}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Edit
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Delete Project">
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => handleDelete(project)}
                                                >
                                                    Delete
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No projects found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <TablePagination
                    component="div"
                    count={projects.totalElements}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            {/* Project Form Modal */}
            <ProjectForm
                open={openForm}
                handleClose={handleFormClose}
                project={selectedProject}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={openConfirm}
                handleClose={handleConfirmClose}
                project={projectToDelete} // Ensure ConfirmDialog uses 'project' prop
            />

            {/* Snackbar for Notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </div>
    );
}

export default ProjectTable;
