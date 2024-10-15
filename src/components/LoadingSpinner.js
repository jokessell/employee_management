// src/components/LoadingSpinner.js
import React from 'react';
import { CircularProgress } from '@mui/material';

function LoadingSpinner() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <CircularProgress />
        </div>
    );
}

export default LoadingSpinner;
