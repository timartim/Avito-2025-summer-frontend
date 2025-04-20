// src/Components/LoadingIndicator.tsx

import React from 'react';
import { CircularProgress, Backdrop } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ReduxStore/store';

/**
 * Компонент индикатора загрузки.
 *
 * При активном флаге isLoading из Redux State отображает
 * полупрозрачный Backdrop с круговым прогресс-баром поверх всего содержимого.
 */
export default function LoadingIndicator() {
   // Флаг, указывающий, что данные загружаются
   const isLoading = useSelector(
      (state: RootState) => state.data.isLoading ?? false
   );

   return (
      <>
         {isLoading && (
               <CircularProgress color="inherit" sx={{mr: 2}} />
         )}
      </>
   );
}
