// src/components/SkillForm.js

import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createSkill, updateSkill } from '../api/skillApi';

function SkillForm({ open, handleClose, skill, setSnackbarOpen, setSnackbarMessage }) {
    const isEditMode = Boolean(skill);

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Skill name is required')
            .max(255, 'Skill name cannot exceed 255 characters'),
    });

    const formik = useFormik({
        initialValues: {
            name: skill ? skill.name : '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (isEditMode) {
                    // Update existing skill
                    await updateSkill(skill.skillId, values);
                    setSnackbarMessage('Skill updated successfully');
                } else {
                    // Create new skill
                    await createSkill(values);
                    setSnackbarMessage('Skill created successfully');
                }
                setSnackbarOpen(true);
                handleClose();
            } catch (error) {
                console.error('Error submitting skill form:', error);
                setSnackbarMessage('Failed to submit skill form');
                setSnackbarOpen(true);
            }
        }
    });

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>{isEditMode ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
            <DialogContent>
                {formik.errors.general && (
                    <Typography color="error">{formik.errors.general}</Typography>
                )}
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        margin="dense"
                        label="Skill Name"
                        name="name"
                        fullWidth
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={formik.handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!(formik.isValid && formik.dirty)}
                >
                    {isEditMode ? 'Update' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default SkillForm;
