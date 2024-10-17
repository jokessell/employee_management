// src/styles/tableStyles.js

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    tableContainer: {
    },
    tableHeader: {
        '& th': {
            backgroundColor: '#f5f5f5',
            fontSize: '0.9rem',
            padding: '4px 6px', // Minimal padding
        },
    },
    tableCell: {
        fontSize: '0.85rem',
        padding: '2px 4px', // Minimal padding
    },
    tableRow: {
        height: '36px',
    },
    addButton: {
        backgroundColor: '#1976d2',
        color: '#fff',
    },
    chip: {
        margin: '2px',
        height: '24px',
        fontSize: '0.75rem',
    },
    avatar: {
        width: '30px',
        height: '30px',
        fontSize: '0.8rem',
    },
    // Styles for dynamic column widths
    dynamicColumn: {
        maxWidth: '300px', // Maximum width for columns
        whiteSpace: 'nowrap',
    },
    avatarColumn: {
        width: '36px', // Slightly wider than avatar image
        padding: '0', // Remove padding
    },
    skillsColumn: {
        width: '300px',
        maxWidth: '300px',
    },
    projectsColumn: {
        width: '300px',
        maxWidth: '300px',
    },
}));

export default useStyles;
