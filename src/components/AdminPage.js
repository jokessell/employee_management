import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Chip,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    ListItemText,
} from '@mui/material';
import { getAllRoles, getAllUsers, assignRole, deleteUser } from '../api/adminApi';
import useStyles from '../styles/tableStyles';

function AdminPage() {
    const classes = useStyles();

    // State variables
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Fetch roles and users when component mounts
    useEffect(() => {
        fetchRoles();
        fetchUsers();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await getAllRoles();
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            setSnackbarMessage('Failed to fetch roles.');
            setSnackbarOpen(true);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setSnackbarMessage('Failed to fetch users.');
            setSnackbarOpen(true);
        }
    };

    // Handle role assignment
    const handleAssignRoles = async () => {
        const isLastAdmin = users.filter((u) => u.roles.includes("ADMIN")).length === 1;

        // Prevent changing the last admin's role if they are the only admin
        if (editUser.roles.includes("ADMIN") && isLastAdmin && selectedRoles[0] !== "ADMIN") {
            setSnackbarMessage("Cannot change the last remaining Admin role. Please assign a new Admin first.");
            setSnackbarOpen(true);
            return;
        }

        try {
            await assignRole({
                username: editUser.username,
                roles: selectedRoles,
            });
            setSnackbarMessage('Role updated successfully.');
            setSnackbarOpen(true);
            setEditUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            setSnackbarMessage('Failed to update role.');
            setSnackbarOpen(true);
        }
    };

    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        const user = users.find(u => u.userId === userId);
        const isLastAdmin = user.roles.includes("ADMIN") && users.filter((u) => u.roles.includes("ADMIN")).length === 1;

        // Prevent deletion of the last remaining admin
        if (isLastAdmin) {
            setSnackbarMessage("Cannot delete the last remaining Admin user.");
            setSnackbarOpen(true);
            return;
        }

        try {
            await deleteUser(userId);
            setSnackbarMessage('User deleted successfully.');
            setSnackbarOpen(true);
            fetchUsers(); // Refresh the user list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
            setSnackbarMessage('Failed to delete user.');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container maxWidth="lg" style={{ padding: '40px 0' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Admin Panel
            </Typography>

            {/* Users Table */}
            <TableContainer component={Paper} className={classes.tableContainer} style={{ marginBottom: '40px' }}>
                <Table>
                    <TableHead>
                        <TableRow className={classes.tableHeader}>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Roles</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => {
                            const isLastAdmin = user.roles.includes("ADMIN") && users.filter((u) => u.roles.includes("ADMIN")).length === 1;
                            return (
                                <TableRow key={user.userId}>
                                    <TableCell>{user.userId}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>
                                        {user.roles.map((role) => (
                                            <Chip key={role} label={role} variant="outlined" />
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {
                                                if (isLastAdmin && user.roles.includes("ADMIN")) {
                                                    setSnackbarMessage("Cannot edit role of the last remaining Admin.");
                                                    setSnackbarOpen(true);
                                                    return;
                                                }
                                                setEditUser(user);
                                                setSelectedRoles(user.roles); // Pre-select current role
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteUser(user.userId)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Editing User Role */}
            <Dialog open={Boolean(editUser)} onClose={() => setEditUser(null)}>
                <DialogTitle>Edit Role for {editUser?.username}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel>Select Role</InputLabel>
                        <Select
                            value={selectedRoles[0] || ""}
                            onChange={(e) => setSelectedRoles([e.target.value])} // Ensure single selection
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.roleId} value={role.roleName}>
                                    <ListItemText primary={role.roleName} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditUser(null)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleAssignRoles();
                            setEditUser(null);
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Container>
    );
}

export default AdminPage;
