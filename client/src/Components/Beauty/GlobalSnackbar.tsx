// src/components/GlobalSnackbar.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { RootState, AppDispatch } from '../ReduxStore/store';
import { hideNotification } from '../ReduxSlices/dataSlice';

export default function GlobalSnackbar() {
   const dispatch = useDispatch<AppDispatch>();
   const { open, message, severity } = useSelector((state: RootState) => state.data.notification);

   const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
         return;
      }
      dispatch(hideNotification());
   };

   return (
      <Snackbar
         open={open}
         autoHideDuration={3000}
         onClose={handleClose}
         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
         <Alert onClose={handleClose} severity={severity} elevation={6} variant="filled">
            {message}
         </Alert>
      </Snackbar>
   );
}