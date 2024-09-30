import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Tooltip,
    Snackbar, TextField, Avatar, Typography
} from '@mui/material';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import EmployeeForm from './EmployeeForm';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';
import axiosInstance from '../api/axiosConfig';

function EmployeeTable() {
    const [employees, setEmployees] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [fetchError, setFetchError] = useState(null); // Ensure this is defined

    // Fetch employees from API
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axiosInstance.get('/employees');
            setEmployees(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Extract more detailed error information
            let errorMsg = 'Failed to fetch employees.';
            if (error.response) {
                // Server responded with a status other than 2xx
                errorMsg += ` Server responded with status ${error.response.status}: ${error.response.data.message || error.response.statusText}`;
            } else if (error.request) {
                // Request was made but no response received
                errorMsg += ' No response received from the server.';
            } else {
                // Something else happened
                errorMsg += ` Error: ${error.message}`;
            }
            setFetchError(errorMsg);
            setLoading(false);
        }
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
                await axiosInstance.delete(`/employees/${employeeToDelete.employeeId}`);
                setSnackbarMessage('Employee deleted successfully');
                setSnackbarOpen(true);
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
                setSnackbarMessage('Failed to delete employee');
                setSnackbarOpen(true);
            }
        }
        setOpenConfirm(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Loading state
    if (loading) {
        return <LoadingSpinner />;
    }

    if (fetchError) {
        return (
            <Typography color="error" variant="h6" align="center" marginTop="20px">
                {fetchError}
            </Typography>
        );
    }

    // Filter employees based on search query
    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Animation variants
    const tableRowVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
    };



    return (
        <motion.div initial="hidden" animate="visible" exit="hidden">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAdd}
                >
                    Add Employee
                </Button>
                <TextField
                    label="Search Employees"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Avatar</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Job Role</strong></TableCell>
                            <TableCell><strong>Date of Birth</strong></TableCell>
                            <TableCell><strong>Age</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Gender</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map((employee) => (
                            <motion.tr
                                key={employee.employeeId}
                                initial="hidden"
                                animate="visible"
                                variants={tableRowVariants}
                                transition={{ duration: 0.3 }}
                            >
                                <TableCell>{employee.employeeId}</TableCell>
                                <TableCell>
                                    {employee.avatarUrl ? (
                                        <Avatar src={employee.avatarUrl} alt={employee.name} />
                                    ) : (
                                        <Avatar>{employee.name.charAt(0)}</Avatar>
                                    )}
                                </TableCell>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.jobRole}</TableCell>
                                <TableCell>{format(new Date(employee.dateOfBirth), 'yyyy-MM-dd')}</TableCell>
                                <TableCell>{employee.age}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.gender}</TableCell>
                                <TableCell align="right">
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
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
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
        </motion.div>
    );
}

export default EmployeeTable;
