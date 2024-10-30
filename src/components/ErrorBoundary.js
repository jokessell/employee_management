import React from 'react';
import { Typography, Container } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Container>
                    <Typography variant="h4" color="error" align="center" sx={{ mt: 5 }}>
                        Something went wrong.
                    </Typography>
                    <Typography variant="body1" align="center">
                        Please try refreshing the page or contact support if the problem persists.
                    </Typography>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
