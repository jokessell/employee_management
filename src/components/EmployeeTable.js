// src/components/EmployeeTable.js

import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Tooltip,
    Snackbar, Typography, CircularProgress,
    TablePagination, Avatar
} from '@mui/material';
import EmployeeForm from './EmployeeForm';
import ConfirmDialog from './ConfirmDialog';
import axiosInstance from '../api/axiosConfig';
import useStyles from '../styles/tableStyles'; // Import shared styles

function EmployeeTable() {
    const classes = useStyles(); // Initialize styles

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

    // Memoize fetchEmployees to prevent unnecessary re-renders
    const fetchEmployees = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/employees', {
                params: {
                    page: page,
                    size: rowsPerPage,
                    sort: 'name,asc',
                },
            });
            console.log('Employees API Response:', response.data); // For debugging
            setEmployees(response.data.content || response.data); // Adjust based on API response
            setTotalElements(response.data.totalElements || response.data.length);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setSnackbarMessage('Failed to fetch employees.');
            setSnackbarOpen(true);
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    // Fetch employees whenever 'fetchEmployees' changes (i.e., when 'page' or 'rowsPerPage' changes)
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Handler for opening the Add Employee form
    const handleAdd = () => {
        setSelectedEmployee(null);
        setOpenForm(true);
    };

    // Handler for editing an existing employee
    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setOpenForm(true);
    };

    // Handler for deleting an employee
    const handleDelete = (employee) => {
        setEmployeeToDelete(employee);
        setOpenConfirm(true);
    };

    // Handler for closing the Employee form modal
    const handleFormClose = () => {
        setOpenForm(false);
        fetchEmployees(); // Refresh the employee list after closing the form
    };

    // Handler for confirming deletion
    const handleConfirmClose = async (confirm) => {
        if (confirm) {
            try {
                await axiosInstance.delete(`/employees/${employeeToDelete.employeeId}`);
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

    // Handler for changing the current page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handler for changing the number of rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Loading state for fetching employees
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
                Employee Management
            </Typography>

            {/* Add Employee Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button
                    variant="contained"
                    className={classes.addButton}
                    onClick={handleAdd}
                >
                    Add Employee
                </Button>
            </div>

            {/* Employees Table */}
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow className={classes.tableHeader}>
                            <TableCell className={classes.tableCell}><strong>ID</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Avatar</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Name</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Job Role</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Date of Birth</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Age</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Email</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Gender</strong></TableCell>
                            <TableCell align="right" className={classes.tableCell}><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.length > 0 ? (
                            employees.map((employee) => (
                                <TableRow key={employee.employeeId} className={classes.tableRow}>
                                    <TableCell className={classes.tableCell}>{employee.employeeId}</TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {employee.avatarUrl ? (
                                            <Avatar src={employee.avatarUrl} alt={employee.name} className={classes.avatar} />
                                        ) : (
                                            <Avatar className={classes.avatar}>{employee.name.charAt(0)}</Avatar>
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>{employee.name}</TableCell>
                                    <TableCell className={classes.tableCell}>{employee.jobRole}</TableCell>
                                    <TableCell className={classes.tableCell}>{employee.dateOfBirth}</TableCell>
                                    <TableCell className={classes.tableCell}>{employee.age}</TableCell>
                                    <TableCell className={classes.tableCell}>{employee.email}</TableCell>
                                    <TableCell className={classes.tableCell}>{employee.gender}</TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        <Tooltip title="Edit Employee">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEdit(employee)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Edit
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Delete Employee">
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleDelete(employee)}
                                            >
                                                Delete
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
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
                project={employeeToDelete} // Adjust prop name if needed
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
