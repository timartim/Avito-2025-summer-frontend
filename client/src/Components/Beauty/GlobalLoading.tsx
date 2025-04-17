import React from 'react';
import { CircularProgress, Box, Backdrop } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../ReduxStore/store';

export default function LoadingIndicator() {
   const isLoading = useSelector((state: RootState) => state.data.isLoading ?? false);

   return (
      <>
         {isLoading && (
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
               <CircularProgress color="inherit" />
            </Backdrop>

         )}
      </>
   );
}
