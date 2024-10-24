import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import AIModal from './AIModal'; // Import AIModal

function NavigationBar() {
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const navigate = useNavigate(); // Define the navigate function using useNavigate hook

    // Handler to open the AIModal
    const handleOpenAiModal = () => {
        setAiModalOpen(true);
    };

    // Handler to close the AIModal
    const handleCloseAiModal = () => {
        setAiModalOpen(false);
    };

    // Handler when data is generated successfully in AIModal
    const handleGenerateSuccess = (generatedData, topic, prompt, recordCount) => {
        setAiModalOpen(false);

        // Navigate to the generated data page with data as state
        navigate('/generated-data', {
            state: {
                generatedData,
                topic,
                prompt,
                recordCount,
            },
        });
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Employee Project Management
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Employees
                    </Button>
                    <Button color="inherit" component={Link} to="/projects">
                        Projects
                    </Button>
                    <Button color="inherit" component={Link} to="/skills">
                        Skills
                    </Button>
                    {/* Instead of directly linking to /generated-data, open the modal */}
                    <Button color="inherit" onClick={handleOpenAiModal}>
                        AI Data
                    </Button>
                </Toolbar>
            </AppBar>

            {/* AIModal should be shown when aiModalOpen is true */}
            <AIModal
                open={aiModalOpen}
                onClose={handleCloseAiModal}
                onGenerate={handleGenerateSuccess}
            />
        </>
    );
}

export default NavigationBar;
