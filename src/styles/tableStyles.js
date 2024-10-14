import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    tableHeader: {
        backgroundColor: '#e0e0e0', // Gray header background
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9', // Light gray for odd rows
        },
        '&:hover': {
            backgroundColor: '#e8eaf6', // Light blue on hover
        },
    },
    tableCell: {
        padding: '8px 16px', // Reduced padding for a sleek look
        fontSize: '0.95rem',
    },
    tableContainer: {
        borderRadius: '8px', // Rounded corners for the table container
    },
    addButton: {
        marginBottom: '20px',
        backgroundColor: '#757575', // Gray button background
        color: '#fff',
        '&:hover': {
            backgroundColor: '#616161', // Darker gray on hover
        },
    },
    avatar: {
        width: '40px',
        height: '40px',
    },
});

export default useStyles;
