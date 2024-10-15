// src/components/SkillTable.js

import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Tooltip,
    Snackbar, Typography, CircularProgress,
    TablePagination
} from '@mui/material';
import SkillForm from './SkillForm'; // Ensure SkillForm.js exists in the same directory
import ConfirmDialog from './ConfirmDialog';
import { getAllSkills, deleteSkill } from '../api/skillApi';
import useStyles from '../styles/tableStyles'; // Import shared styles

function SkillTable() {
    const classes = useStyles(); // Initialize styles

    // State variables
    const [skills, setSkills] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0); // Ensure totalElements is used

    // Fetch skills with pagination
    const fetchSkills = useCallback(async () => {
        try {
            const response = await getAllSkills({
                page: page,
                size: rowsPerPage,
                sort: 'name,asc',
            });
            setSkills(response.data.content || response.data); // Adjust based on API response structure
            setTotalElements(response.data.totalElements || response.data.length); // Set totalElements correctly
            setLoading(false);
        } catch (error) {
            console.error('Error fetching skills:', error);
            setSnackbarMessage('Failed to fetch skills.');
            setSnackbarOpen(true);
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    // Handlers
    const handleAdd = () => {
        setSelectedSkill(null);
        setOpenForm(true);
    };

    const handleEdit = (skill) => {
        setSelectedSkill(skill);
        setOpenForm(true);
    };

    const handleDelete = (skill) => {
        setSkillToDelete(skill);
        setOpenConfirm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        fetchSkills();
    };

    const handleConfirmClose = async (confirm) => {
        if (confirm) {
            try {
                await deleteSkill(skillToDelete.skillId);
                setSnackbarMessage('Skill deleted successfully.');
                setSnackbarOpen(true);
                fetchSkills();
            } catch (error) {
                console.error('Error deleting skill:', error);
                setSnackbarMessage('Failed to delete skill.');
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
                Skill Management
            </Typography>

            {/* Add Skill Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button
                    variant="contained"
                    className={classes.addButton}
                    onClick={handleAdd}
                >
                    Add Skill
                </Button>
            </div>

            {/* Skills Table */}
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow className={classes.tableHeader}>
                            <TableCell className={classes.tableCell}><strong>ID</strong></TableCell>
                            <TableCell className={classes.tableCell}><strong>Name</strong></TableCell>
                            <TableCell align="right" className={classes.tableCell}><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {skills.length > 0 ? (
                            skills.map((skill) => (
                                <TableRow key={skill.skillId} className={classes.tableRow}>
                                    <TableCell className={classes.tableCell}>{skill.skillId}</TableCell>
                                    <TableCell className={classes.tableCell}>{skill.name}</TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        <Tooltip title="Edit Skill">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEdit(skill)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Edit
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Delete Skill">
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleDelete(skill)}
                                            >
                                                Delete
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No skills found.
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

            {/* Skill Form Modal */}
            <SkillForm
                open={openForm}
                handleClose={handleFormClose}
                skill={selectedSkill}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={openConfirm}
                handleClose={handleConfirmClose}
                project={skillToDelete} // Ensure ConfirmDialog uses 'project' prop appropriately
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

export default SkillTable;
