// src/components/ConfirmDialog.js

import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Slide
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

function ConfirmDialog({ open, handleClose, project }) { // Renamed prop to 'project' for clarity
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={() => handleClose(false)}
        >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete <strong>{project?.name || project?.projectName}</strong>?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)}>Cancel</Button>
                <Button
                    onClick={() => handleClose(true)}
                    variant="contained"
                    color="error"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
