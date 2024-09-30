import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';

function LoadingSpinner() {
    return (
        <Box display="flex" justifyContent="center" marginTop="40px">
            <motion.div
                initial={{rotate: 0}}
                animate={{rotate: 360}}
                transition={{duration: 1, repeat: Infinity, repeatType: "loop"}}
            >
                <CircularProgress/>
            </motion.div>

        </Box>
    );
}

export default LoadingSpinner;
