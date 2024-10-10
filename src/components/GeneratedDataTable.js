import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Snackbar, Typography,
    CircularProgress
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';

function GeneratedDataTable() {
    const location = useLocation();
    const navigate = useNavigate();

    const { generatedData, topic, prompt, recordCount } = location.state || {};
    const [data, setData] = useState(generatedData || []);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateMore = async () => {
        if (data.length === 0) {
            setSnackbarMessage('No existing data to base new records on.');
            setSnackbarOpen(true);
            return;
        }

        try {
            setIsGenerating(true);

            const count = recordCount || 5;
            const properties = Object.keys(data[0]);

            // Prepare the request payload
            const values = {
                topic: topic || 'Data',
                recordCount: count,
                properties: properties,
            };

            // Make the API call to the new endpoint
            const response = await axiosInstance.post('/ai/generate-more-data', values);

            console.log("API Response:", response.data);

            let newGeneratedData = null;

            if (Array.isArray(response.data)) {
                if (typeof response.data[0] === 'string') {
                    newGeneratedData = response.data.map((item) => JSON.parse(item));
                } else {
                    newGeneratedData = response.data;
                }
            } else {
                console.error("Unexpected response format", response.data);
                setSnackbarMessage('Failed to generate more data: Invalid format');
                setSnackbarOpen(true);
                return;
            }

            console.log("New Generated Data:", newGeneratedData);

            // Append the new data to the existing data with animation
            setData((prevData) => [...prevData, ...newGeneratedData]);
            setSnackbarMessage('Additional data generated successfully');
            setSnackbarOpen(true);

        } catch (error) {
            console.error('Error generating more data:', error);
            setSnackbarMessage('Failed to generate more data');
            setSnackbarOpen(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExportToJson = () => {
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `${topic || 'data'}.json`;
        link.href = url;
        link.click();
    };

    // Animation variants for table rows
    const tableRowVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '50px 0' }}>
            <Typography variant="h3" align="center" gutterBottom>
                {topic}
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
                {prompt}
            </Typography>

            <div style={{ maxWidth: '80%', margin: '0 auto', textAlign: 'center' }}>
                {/* Generate More Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateMore}
                    style={{ marginBottom: '20px' }}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating...' : `Generate ${recordCount || 5} More`}
                </Button>

                {/* Show CircularProgress while AI data is generating */}
                {isGenerating && (
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <CircularProgress />
                    </div>
                )}

                <TableContainer component={Paper} style={{ maxWidth: '90%', margin: '0 auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#e0e0e0' }}>
                                {Object.keys(data[0]).map((key) => (
                                    <TableCell key={key}><strong>{key}</strong></TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody component={motion.tbody}>
                            <AnimatePresence>
                                {data.map((record, idx) => (
                                    <motion.tr
                                        key={idx}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={tableRowVariants}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {Object.values(record).map((value, i) => (
                                            <TableCell key={i}>{value}</TableCell>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Export to JSON Button */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleExportToJson}
                    style={{ marginTop: '20px' }}
                >
                    Export to JSON
                </Button>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                />

                {/* Back to Employee Management */}
                <div style={{ marginTop: '20px' }}>
                    <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                        Back to Employee Management
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default GeneratedDataTable;
