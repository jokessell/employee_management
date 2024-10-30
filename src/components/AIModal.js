import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, CircularProgress, LinearProgress, Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../api/axiosConfig';

function AIModal({ open, onClose, onGenerate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const [progressValue, setProgressValue] = useState(0); // Simulated progress

    useEffect(() => {
        let progressInterval;

        if (isLoading) {
            // Progressive disclosure step updates
            let currentStep = 0;
            const steps = [
                { message: 'Step 1: Connecting to OpenAI servers...', progress: 10 },
                { message: 'Step 2: Sending your request...', progress: 30 },
                { message: 'Step 3: AI is thinking...', progress: 50 },
                { message: 'Step 4: Analyzing data...', progress: 70 },
                { message: 'Step 5: Almost ready...', progress: 90 },
            ];

            progressInterval = setInterval(() => {
                if (currentStep < steps.length) {
                    setProgressMessage(steps[currentStep].message);
                    setProgressValue(steps[currentStep].progress);
                    currentStep++;
                }
            }, 3000); // Every 3 seconds

            return () => clearInterval(progressInterval);
        }
    }, [isLoading]);

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
        onSubmit: async (values) => {
            try {
                setIsLoading(true);

                // Simulated delay for the progressive messages
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate 5 seconds

                // Make API request to OpenAI
                setProgressMessage('Sending request to OpenAI API...');
                const response = await axiosInstance.post('/ai/generate-data', values);

                // Log the response to the console to inspect the structure
                console.log("Response from OpenAI API:", response.data);

                if (response.data) {
                    setProgressMessage('Complete! Generating data...');

                    // Once done, pass the data to the onGenerate prop
                    onGenerate(
                        response.data,
                        values.topic,
                        `Generated ${values.recordCount} records with ${values.propertyCount} properties for the topic "${values.topic}".`,
                        values.recordCount
                    );
                }
            } catch (error) {
                console.error('Error generating data:', error);
                setProgressMessage('Failed to generate data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Data with AI</DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <CircularProgress />
                        <Typography variant="body1" style={{ marginTop: '20px' }}>
                            {progressMessage}
                        </Typography>
                        <LinearProgress variant="determinate" value={progressValue} style={{ marginTop: '20px' }} />
                    </div>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
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
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                <Button
                    onClick={formik.handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                >
                    Generate
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AIModal;
