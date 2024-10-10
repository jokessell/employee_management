import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function AIModal({ open, onClose, onGenerate }) {
    // Define validation schema using Yup
    const validationSchema = Yup.object({
        topic: Yup.string()
            .required('Topic is required')
            .max(50, 'Topic must be 50 characters or less'),
        propertyCount: Yup.number()
            .required('Number of properties is required')
            .min(3, 'Minimum 3 properties')
            .max(10, 'Maximum 10 properties'),
        recordCount: Yup.number()
            .required('Number of records is required')
            .min(1, 'Minimum 1 record')
            .max(50, 'Maximum 50 records'),
    });

    // Formik for form handling
    const formik = useFormik({
        initialValues: {
            topic: '',
            propertyCount: 5,
            recordCount: 5,
        },
        validationSchema,
        onSubmit: (values) => {
            // Call onGenerate with the validated values
            onGenerate(values);
            onClose(); // Close the modal when valid
        },
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Data with AI</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    {/* Topic Field */}
                    <TextField
                        margin="dense"
                        label="Topic"
                        name="topic"
                        fullWidth
                        value={formik.values.topic}
                        onChange={formik.handleChange}
                        error={formik.touched.topic && Boolean(formik.errors.topic)}
                        helperText={formik.touched.topic && formik.errors.topic}
                    />
                    {/* Number of Properties Field */}
                    <TextField
                        margin="dense"
                        label="Number of Properties"
                        name="propertyCount"
                        type="number"
                        fullWidth
                        value={formik.values.propertyCount}
                        onChange={formik.handleChange}
                        error={formik.touched.propertyCount && Boolean(formik.errors.propertyCount)}
                        helperText={formik.touched.propertyCount && formik.errors.propertyCount}
                    />
                    {/* Number of Records Field */}
                    <TextField
                        margin="dense"
                        label="Number of Records"
                        name="recordCount"
                        type="number"
                        fullWidth
                        value={formik.values.recordCount}
                        onChange={formik.handleChange}
                        error={formik.touched.recordCount && Boolean(formik.errors.recordCount)}
                        helperText={formik.touched.recordCount && formik.errors.recordCount}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={formik.handleSubmit}
                    variant="contained"
                    color="primary"
                >
                    Generate
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AIModal;
