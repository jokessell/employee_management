import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Tooltip,
    Snackbar, TextField, Avatar, Typography, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import EmployeeForm from './EmployeeForm';
import ConfirmDialog from './ConfirmDialog';
import AIModal from './AIModal';
import axiosInstance from '../api/axiosConfig';

function EmployeeTable() {
    const [employees, setEmployees] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false); // Used for loading state while generating AI data
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [fetchError, setFetchError] = useState(null);
    const [aiModalOpen, setAIModalOpen] = useState(false);
    const navigate = useNavigate();

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
            let errorMsg = 'Failed to fetch employees.';
            if (error.response) {
                errorMsg += ` Server responded with status ${error.response.status}: ${error.response.data.message || error.response.statusText}`;
            } else if (error.request) {
                errorMsg += ' No response received from the server.';
            } else {
                errorMsg += ` Error: ${error.message}`;
            }
            setFetchError(errorMsg);
            setLoading(false);
        }
    };

    const handleGenerateAIData = async (values) => {
        try {
            setIsGenerating(true);

            // Remove prompt from values
            const { topic, propertyCount, recordCount } = values;

            // Prepare the request payload without prompt
            const payload = { topic, propertyCount, recordCount };

            const response = await axiosInstance.post('/ai/generate-data', payload);

            console.log("Raw API Response:", response.data);

            let parsedData = null;

            if (Array.isArray(response.data)) {
                parsedData = response.data.map((item) => JSON.parse(item));
            } else {
                console.error("Unexpected response format", response.data);
                setSnackbarMessage('Failed to generate AI data: Invalid format');
                setSnackbarOpen(true);
                return;
            }

            navigate('/generated-data', {
                state: {
                    generatedData: parsedData,
                    topic: topic,
                    recordCount: recordCount,
                },
            });
        } catch (error) {
            console.error('Error generating AI data:', error);
            setSnackbarMessage('Failed to generate AI data');
            setSnackbarOpen(true);
        } finally {
            setIsGenerating(false);
        }
    };




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

    const handleFormClose = () => {
        setOpenForm(false);
        fetchEmployees(); // Refresh the employee list after closing the form
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

    // Loading state for fetching employees
    if (loading) {
        return <CircularProgress/>;
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
        employee.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Animation variants
    const tableRowVariants = {
        hidden: {opacity: 0, y: 15},
        visible: {opacity: 1, y: 0},
    };

    return (
        <>
            {/* Apply blur when generating AI data */}
            <div style={{
                backgroundColor: '#f5f5f5',
                padding: '40px 0',
                minHeight: '100vh',
                filter: isGenerating ? 'blur(5px)' : 'none'
            }}>
                <motion.div initial="hidden" animate="visible" exit="hidden">
                    {/* Title */}
                    <Typography variant="h3" align="center" gutterBottom
                                style={{color: '#424242', paddingBottom: '20px'}}>
                        Employee Management System
                    </Typography>

                    {/* Container for Add Employee Button and Search Bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '70%',      // Match the table width
                        margin: '0 auto 20px' // Center the container and add space below it
                    }}>
                        <Button
                            variant="contained"
                            style={{backgroundColor: '#757575', color: '#fff'}}  // Grayscale button for Add Employee
                            onClick={handleAdd}
                        >
                            Add Employee
                        </Button>
                        <TextField
                            label="Search Employees"
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{
                                marginBottom: '0',     // Align with the top edge of the table
                                width: '250px'         // Fixed width for consistent alignment
                            }}
                        />
                    </div>

                    {/* Table */}
                    <TableContainer component={Paper} style={{
                        maxWidth: '80%',         // Limit the width of the table
                        margin: '0 auto',        // Center the table on the page
                        borderRadius: '10px'
                    }}>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#e0e0e0', color: '#424242' }}>
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
                                        transition={{duration: 0.3}}
                                    >
                                        <TableCell>{employee.employeeId}</TableCell>
                                        <TableCell>
                                            {employee.avatarUrl ? (
                                                <Avatar src={employee.avatarUrl} alt={employee.name}/>
                                            ) : (
                                                <Avatar>{employee.name.charAt(0)}</Avatar>
                                            )}
                                        </TableCell>
                                        <TableCell style={{
                                            color: '#424242',
                                            borderBottom: '1px solid #bdbdbd'
                                        }}>{employee.name}</TableCell> {/* Grayscale row cells */}
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
                                                    style={{marginRight: '10px'}}
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

                    {/* Create Data with AI Button below the table, centered */}
                    <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <Button
                            variant="contained"
                            style={{backgroundColor: '#757575', color: '#fff'}}  // Grayscale button
                            onClick={() => setAIModalOpen(true)}
                        >
                            Create Data with AI
                        </Button>
                    </div>

                    {/* AI Modal for input */}
                    <AIModal
                        open={aiModalOpen}
                        onClose={() => setAIModalOpen(false)}
                        onGenerate={handleGenerateAIData}  // Pass the handler to generate AI data
                    />

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
            </div>

            {/* Show CircularProgress while AI data is generating */}
            {isGenerating && (
                <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                    <CircularProgress/>
                </div>
            )}
        </>
    );

}

    export default EmployeeTable;
