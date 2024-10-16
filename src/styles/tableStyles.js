// src/styles/tableStyles.js

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    tableHeader: {
        backgroundColor: '#e0e0e0',
    },
    tableCell: {
        color: '#fff',
        fontWeight: 'bold',
        padding: '6px 8px', // Reduced padding
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        fontSize: '0.875rem', // Smaller font size
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#f5f5f5',
        },
    },
    addButton: {
        backgroundColor: '#1976d2',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#115293',
        },
    },
    formField: {
        marginTop: '8px',
    },
    // Additional styles for compactness
    chip: {
        height: '24px',
        fontSize: '0.75rem',
    },
});

export default useStyles;
