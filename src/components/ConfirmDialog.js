// src/components/ConfirmDialog.js

import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button
} from '@mui/material';

function ConfirmDialog({ open, handleClose, item }) {
    return (
        <Dialog
            open={open}
            onClose={() => handleClose(false)}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    Are you sure you want to delete "{item?.name || 'this item'}"?
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => handleClose(true)} color="secondary" autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
