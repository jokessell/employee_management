// src/components/EmployeeTable.js

import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Tooltip,
    Snackbar, Typography, CircularProgress,
    TablePagination, Avatar, Chip, Stack, TableSortLabel
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import WorkIcon from '@mui/icons-material/Work';
import CheckIcon from '@mui/icons-material/Check'; // Import the checkmark icon
import EmployeeForm from './EmployeeForm';
import ConfirmDialog from './ConfirmDialog';
import { getAllEmployees, deleteEmployee } from '../api/employeeApi';
import useStyles from '../styles/tableStyles';

function EmployeeTable() {
    const classes = useStyles();

    // State variables
    const [employees, setEmployees] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    // New state variables for sorting
    const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
    const [orderBy, setOrderBy] = useState('employeeId'); // Default sort by employeeId
    const [hoveredProjectId, setHoveredProjectId] = useState(null);
    const [hoveredProjectSkills, setHoveredProjectSkills] = useState([]);

    // Fetch employees with pagination and sorting
    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllEmployees({
                page: page,
                size: rowsPerPage,
                sort: `${orderBy},${order}`,
            });
            console.log('Fetched Employees:', response.data); // Log the response
            setEmployees(response.data.content || response.data);
            setTotalElements(response.data.totalElements || response.data.length);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setSnackbarMessage('Failed to fetch employees.');
            setSnackbarOpen(true);
            setLoading(false);
        }
    }, [page, rowsPerPage, order, orderBy]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Sorting handler
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        setPage(0); // Reset to first page on sort
    };

    // Handlers
    const handleAdd = () => {
        setSelectedEmployee(null);
        setOpenForm(true);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setOpenForm(true);
    };

    const handleDelete = (employee) => {
        setEmployeeToDelete(employee);
        setOpenConfirm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        fetchEmployees();
    };

    const handleConfirmClose = async (confirm) => {
        if (confirm) {
            try {
                await deleteEmployee(employeeToDelete.employeeId);
                setSnackbarMessage('Employee deleted successfully.');
                setSnackbarOpen(true);
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
                setSnackbarMessage('Failed to delete employee.');
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

    const handleProjectHover = (projectId, projectSkills) => {
        setHoveredProjectId(projectId);
        setHoveredProjectSkills(projectSkills);
    };

    const handleProjectLeave = () => {
        setHoveredProjectId(null);
        setHoveredProjectSkills([]);
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
                Employee Management
            </Typography>

            {/* Add Employee Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <Button
                    variant="contained"
                    className={classes.addButton}
                    onClick={handleAdd}
                    size="small"
                >
                    Add Employee
                </Button>
            </div>

            {/* Employees Table */}
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow className={classes.tableHeader}>
                            {/* Adjusted column widths and styles */}
                            {/* ID Column */}
                            <TableCell
                                className={classes.tableCell}
                                style={{ width: '50px' }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'employeeId'}
                                    direction={orderBy === 'employeeId' ? order : 'asc'}
                                    onClick={() => handleRequestSort('employeeId')}
                                >
                                    <strong>ID</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Avatar Column */}
                            <TableCell
                                className={classes.tableCell}
                                style={{ width: '70px' }}
                            >
                                <strong>Avatar</strong>
                            </TableCell>

                            {/* Name Column */}
                            <TableCell
                                className={classes.tableCell}
                                style={{ width: '120px' }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    <strong>Name</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Job Role Column */}
                            <TableCell
                                className={classes.tableCell}
                                style={{ width: '120px' }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'jobRole'}
                                    direction={orderBy === 'jobRole' ? order : 'asc'}
                                    onClick={() => handleRequestSort('jobRole')}
                                >
                                    <strong>Job Role</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Date of Birth Column */}
                            <TableCell
                                className={classes.tableCell}
                                style={{ width: '100px' }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'dateOfBirth'}
                                    direction={orderBy === 'dateOfBirth' ? order : 'asc'}
                                    onClick={() => handleRequestSort('dateOfBirth')}
                                >
                                    <strong>DOB</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Age Column */}
                            <TableCell
                                className={classes.tableCell}
                                style={{ width: '50px' }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'age'}
                                    direction={orderBy === 'age' ? order : 'asc'}
                                    onClick={() => handleRequestSort('age')}
                                >
                                    <strong>Age</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Email Column */}
                            <TableCell className={classes.tableCell}>
                                <TableSortLabel
                                    active={orderBy === 'email'}
                                    direction={orderBy === 'email' ? order : 'asc'}
                                    onClick={() => handleRequestSort('email')}
                                >
                                    <strong>Email</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Gender Column */}
                            <TableCell
                                className={classes.tableCell}
                                style={{ width: '80px' }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'gender'}
                                    direction={orderBy === 'gender' ? order : 'asc'}
                                    onClick={() => handleRequestSort('gender')}
                                >
                                    <strong>Gender</strong>
                                </TableSortLabel>
                            </TableCell>

                            {/* Skills Column */}
                            <TableCell className={classes.tableCell}>
                                <strong>Skills</strong>
                            </TableCell>

                            {/* Projects Column */}
                            <TableCell className={classes.tableCell}>
                                <strong>Projects</strong>
                            </TableCell>

                            {/* Actions Column */}
                            <TableCell
                                align="right"
                                className={classes.tableCell}
                                style={{ width: '150px' }}
                            >
                                <strong>Actions</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.length > 0 ? (
                            employees.map((employee) => (
                                <TableRow key={employee.employeeId} className={classes.tableRow}>
                                    {/* ID Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.employeeId}
                                    </TableCell>

                                    {/* Avatar Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.avatarUrl ? (
                                            <Avatar
                                                src={employee.avatarUrl}
                                                alt={employee.name}
                                                className={classes.avatar}
                                            />
                                        ) : (
                                            <Avatar className={classes.avatar}>
                                                {employee.name.charAt(0)}
                                            </Avatar>
                                        )}
                                    </TableCell>

                                    {/* Name Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.name}
                                    </TableCell>

                                    {/* Job Role Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.jobRole}
                                    </TableCell>

                                    {/* Date of Birth Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.dateOfBirth}
                                    </TableCell>

                                    {/* Age Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.age}
                                    </TableCell>

                                    {/* Email Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.email}
                                    </TableCell>

                                    {/* Gender Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.gender}
                                    </TableCell>

                                    {/* Skills Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.skills && employee.skills.length > 0 ? (
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                flexWrap="wrap"
                                                alignItems="flex-start"
                                                sx={{ rowGap: '5px' }}
                                            >
                                                {employee.skills.map((skill) => (
                                                    <Chip
                                                        key={skill.skillId}
                                                        label={skill.name}
                                                        variant="outlined"
                                                        size="small"
                                                        className={classes.chip}
                                                        icon={<BuildIcon style={{ fontSize: '1rem' }} />}
                                                        style={
                                                            hoveredProjectSkills.some(
                                                                (pSkill) => pSkill.skillId === skill.skillId
                                                            )
                                                                ? { backgroundColor: 'lightgreen' }
                                                                : {}
                                                        }
                                                    />
                                                ))}
                                            </Stack>
                                        ) : (
                                            'None'
                                        )}
                                    </TableCell>

                                    {/* Projects Cell */}
                                    <TableCell className={classes.tableCell}>
                                        {employee.projects && employee.projects.length > 0 ? (
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                flexWrap="wrap"
                                                alignItems="flex-start"
                                                sx={{ rowGap: '5px' }}
                                            >
                                                {employee.projects.map((project) => (
                                                    <Tooltip
                                                        key={project.projectId}
                                                        title={
                                                            <div>
                                                                Required Skills:
                                                                <ul style={{ paddingLeft: '15px', margin: 0 }}>
                                                                    {project.skills.map((skill) => (
                                                                        <li
                                                                            key={skill.skillId}
                                                                            style={{ display: 'flex', alignItems: 'center' }}
                                                                        >
                                                                            {employee.skills.some(
                                                                                (eSkill) => eSkill.skillId === skill.skillId
                                                                            ) && (
                                                                                <CheckIcon
                                                                                    style={{
                                                                                        fontSize: '1rem',
                                                                                        marginRight: '4px',
                                                                                        color: 'green',
                                                                                    }}
                                                                                />
                                                                            )}
                                                                            {skill.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        }
                                                        placement="bottom"
                                                        arrow
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    fontSize: '1em', // Increase font size
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // More opaque background
                                                                    padding: 2, // Increase padding
                                                                    maxWidth: 'none', // Remove max-width restriction
                                                                },
                                                            },
                                                            arrow: {
                                                                sx: {
                                                                    color: 'rgba(0, 0, 0, 0.9)', // Match tooltip background color
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <Chip
                                                            key={project.projectId}
                                                            label={project.projectName || project.name}
                                                            variant="outlined"
                                                            size="small"
                                                            className={classes.chip}
                                                            icon={<WorkIcon style={{ fontSize: '1rem' }} />}
                                                            onMouseEnter={() =>
                                                                handleProjectHover(project.projectId, project.skills)
                                                            }
                                                            onMouseLeave={handleProjectLeave}
                                                            style={
                                                                hoveredProjectId === project.projectId
                                                                    ? { backgroundColor: 'lightblue' }
                                                                    : {}
                                                            }
                                                        />
                                                    </Tooltip>
                                                ))}
                                            </Stack>
                                        ) : (
                                            'None'
                                        )}
                                    </TableCell>


                                    {/* Actions Cell */}
                                    <TableCell align="right" className={classes.tableCell}>
                                        {/* Flex container for buttons */}
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Tooltip title="Edit Employee">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleEdit(employee)}
                                                    size="small"
                                                    style={{ marginRight: '8px' }}
                                                >
                                                    Edit
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Delete Employee">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleDelete(employee)}
                                                    size="small"
                                                >
                                                    Delete
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={11} align="center">
                                    No employees found.
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

            {/* Employee Form Modal */}
            <EmployeeForm
                open={openForm}
                handleClose={handleFormClose}
                employee={selectedEmployee}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={openConfirm}
                handleClose={handleConfirmClose}
                employee={employeeToDelete}
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

export default EmployeeTable;
