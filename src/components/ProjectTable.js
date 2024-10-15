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
import { getAllProjects, deleteProject } from '../api/projectApi'; // Ensure deleteProject is imported
import useStyles from '../styles/tableStyles'; // Import shared styles

function ProjectTable() {
    const classes = useStyles(); // Initialize styles

    // State variables
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
    const [totalElements, setTotalElements] = useState(0); // Ensure totalElements is used

    // Fetch projects with pagination
    const fetchProjects = useCallback(async () => {
        try {
            const response = await getAllProjects({
                page: page,
                size: rowsPerPage,
                sort: 'projectName,asc',
            });
            setProjects(response.data.content || response.data); // Adjust based on API response structure
            setTotalElements(response.data.totalElements || response.data.length); // Set totalElements correctly
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setSnackbarMessage('Failed to fetch projects.');
            setSnackbarOpen(true);
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Handlers
    const handleAdd = () => {
        setSelectedProject(null);
        setOpenForm(true);
    };

    const handleEdit = (project) => {
        setSelectedProject(project);
        setOpenForm(true);
    };

    const handleDelete = (project) => {
        setProjectToDelete(project);
        setOpenConfirm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        fetchProjects();
    };

    const handleConfirmClose = async (confirm) => {
        if (confirm) {
            try {
                await deleteProject(projectToDelete.projectId);
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

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Loading state
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
                            <TableCell className={classes.tableCell}><strong>Assigned Employees</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Required Skills</strong></TableCell>
                            <TableCell align="right" className={classes.tableCell}><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <TableRow key={project.projectId} className={classes.tableRow}>
                                    <TableCell className={classes.tableCell}>{project.projectId}</TableCell>
                                    <TableCell className={classes.tableCell}>{project.projectName}</TableCell>
                                    <TableCell className={classes.tableCell}>{project.description}</TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {project.employees && project.employees.length > 0
                                            ? project.employees.map(emp => `${emp.employeeId} - ${emp.name}`).join(', ')
                                            : 'None'}
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {project.skills && project.skills.length > 0
                                            ? project.skills.map(skill => skill.name).join(', ')
                                            : 'None'}
                                    </TableCell>
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
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No projects found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <TablePagination
                    component="div"
                    count={totalElements}
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
                project={projectToDelete} // Ensure ConfirmDialog uses 'project' prop appropriately
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
