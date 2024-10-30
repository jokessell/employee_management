// src/components/NavigationBar.js
import React, { useState, useContext, useMemo } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    useMediaQuery,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AIModal from './AIModal';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import { memo } from 'react';

// Memoize the NavigationBar to prevent unnecessary re-renders
const NavigationBar = memo(() => {
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Define navigation links with associated roles
    const navLinks = useMemo(() => [
        { label: 'Home', path: '/', roles: ['BASIC', 'ELEVATED', 'ADMIN'] },
        { label: 'Employees', path: '/employees', roles: ['BASIC', 'ELEVATED', 'ADMIN'] },
        { label: 'Projects', path: '/projects', roles: ['BASIC', 'ELEVATED', 'ADMIN'] },
        { label: 'Skills', path: '/skills', roles: ['BASIC', 'ELEVATED', 'ADMIN'] },
        { label: 'Admin', path: '/admin', roles: ['ADMIN'] },
    ], []);

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

    // Handler for logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Function to determine if a link should be displayed based on user roles
    const shouldDisplay = (linkRoles) => {
        if (!auth.token) return false; // Only show role-based links to authenticated users
        if (linkRoles.length === 0) return true; // Public link
        return linkRoles.some(role => auth.roles.includes(role));
    };

    // Toggle Drawer (for mobile view)
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Render navigation links
    const renderNavLinks = () => (
        navLinks.map((link) => (
            shouldDisplay(link.roles) && (
                <Button
                    key={link.label}
                    color="inherit"
                    component={Link}
                    to={link.path}
                    sx={{
                        borderBottom: location.pathname === link.path ? '2px solid white' : 'none',
                        textDecoration: 'none',
                    }}
                    aria-label={`Navigate to ${link.label}`}
                >
                    {link.label}
                </Button>
            )
        ))
    );

    // Render Drawer content for mobile view
    const renderDrawer = () => (
        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
        >
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer}
                onKeyDown={toggleDrawer}
            >
                <List>
                    {navLinks.map((link) => (
                        shouldDisplay(link.roles) && (
                            <ListItem button component={Link} to={link.path} key={link.label}>
                                <ListItemText primary={link.label} />
                            </ListItem>
                        )
                    ))}
                    {/* AI Data Link */}
                    <ListItem button onClick={handleOpenAiModal}>
                        <ListItemText primary="AI Data" />
                    </ListItem>
                    {/* Logout or Login */}
                    {auth.token ? (
                        <ListItem button onClick={handleLogout}>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    ) : (
                        <ListItem button component={Link} to="/login">
                            <ListItemText primary="Login" />
                        </ListItem>
                    )}
                </List>
            </Box>
        </Drawer>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Employee Project Management
                    </Typography>
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {renderNavLinks()}
                            {/* AI Data link is always visible */}
                            <Button color="inherit" onClick={handleOpenAiModal} aria-label="Open AI Data Modal">
                                AI Data
                            </Button>
                            {/* Show Logout button if authenticated, else Login */}
                            {auth.token ? (
                                <Button color="inherit" onClick={handleLogout} aria-label="Logout">
                                    Logout
                                </Button>
                            ) : (
                                <Button color="inherit" component={Link} to="/login" aria-label="Login">
                                    Login
                                </Button>
                            )}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Render Drawer for mobile view */}
            {isMobile && renderDrawer()}

            {/* AIModal should be shown when aiModalOpen is true */}
            <AIModal
                open={aiModalOpen}
                onClose={handleCloseAiModal}
                onGenerate={handleGenerateSuccess}
            />
        </>
    );
});

export default NavigationBar;
