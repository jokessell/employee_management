// src/components/ProjectTable.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button,
    Snackbar, Typography, CircularProgress,
    TablePagination, TableSortLabel
} from '@mui/material';
import ProjectForm from './ProjectForm';
import ConfirmDialog from './ConfirmDialog';
import { getAllProjects, deleteProject } from '../api/projectApi';
import useStyles from '../styles/tableStyles';
import ProjectRow from './ProjectRow';
import { AuthContext } from '../context/AuthContext';

function ProjectTable() {
    const classes = useStyles();
    const { auth } = useContext(AuthContext);

    // Role-based permissions
    const canEdit = auth.roles.includes('ELEVATED') || auth.roles.includes('ADMIN');

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
    const [totalElements, setTotalElements] = useState(0);
    const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('projectId'); // Default sort by projectId

    // Fetch projects with pagination and sorting
    const fetchProjects = useCallback(async () => {
        setLoading(true); // Start loading
        try {
            const response = await getAllProjects({
                page: page,
                size: rowsPerPage,
                sort: `${orderBy},${order}`,
            });
            console.log('Fetched Projects:', response.data); // Debugging

            // Assuming response.data.content contains the array of projects
            setProjects(response.data.content || []);
            setTotalElements(response.data.totalElements || response.data.length);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setSnackbarMessage('Failed to fetch projects.');
            setSnackbarOpen(true);
            setLoading(false);
        }
    }, [page, rowsPerPage, order, orderBy]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Sorting handler
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        setPage(0); // Reset to first page on sort
    };

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
        <div style={{ padding: '20px' }}>
            {/* Title */}
            <Typography variant="h5" align="center" gutterBottom>
                Project Management
            </Typography>

            {/* Add Project Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <Button
                    variant="contained"
                    className={classes.addButton}
                    onClick={handleAdd}
                    size="small"
                    disabled={!canEdit}
                >
                    Add Project
                </Button>
            </div>

            {/* Projects Table */}
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow className={classes.tableHeader}>
                            {/* Table headers with adjusted styles and widths */}
                            {/* ID Column */}
                            <TableCell className={classes.tableCell} style={{ width: '50px' }}>
                                <TableSortLabel
                                    active={orderBy === 'projectId'}
                                    direction={orderBy === 'projectId' ? order : 'asc'}
                                    onClick={() => handleRequestSort('projectId')}
                                >
                                    <strong>ID</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Project Name Column */}
                            <TableCell className={classes.tableCell} style={{ width: '150px' }}>
                                <TableSortLabel
                                    active={orderBy === 'projectName'}
                                    direction={orderBy === 'projectName' ? order : 'asc'}
                                    onClick={() => handleRequestSort('projectName')}
                                >
                                    <strong>Project Name</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Description Column */}
                            <TableCell className={classes.tableCell} style={{ width: '200px' }}>
                                <TableSortLabel
                                    active={orderBy === 'description'}
                                    direction={orderBy === 'description' ? order : 'asc'}
                                    onClick={() => handleRequestSort('description')}
                                >
                                    <strong>Description</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Assigned Employees Column */}
                            <TableCell className={`${classes.tableCell} ${classes.projectsColumn}`}>
                                <TableSortLabel
                                    active={orderBy === 'employees'}
                                    direction={orderBy === 'employees' ? order : 'asc'}
                                    onClick={() => handleRequestSort('employees')}
                                >
                                    <strong>Assigned Employees</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Required Skills Column */}
                            <TableCell className={`${classes.tableCell} ${classes.skillsColumn}`}>
                                <TableSortLabel
                                    active={orderBy === 'skills'}
                                    direction={orderBy === 'skills' ? order : 'asc'}
                                    onClick={() => handleRequestSort('skills')}
                                >
                                    <strong>Required Skills</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Actions Column */}
                            <TableCell align="right" className={classes.tableCell} style={{ width: '100px' }}>
                                <strong>Actions</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <ProjectRow
                                    key={project.projectId}
                                    project={project}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    classes={classes}
                                    authRoles={auth.roles} // Pass user roles
                                />
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
                project={projectToDelete}
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
