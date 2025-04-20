// src/components/GlobalSnackbar.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { RootState, AppDispatch } from '../../../ReduxStore/store';
import { hideNotification } from '../../../ReduxSlices/dataSlice';

/**
 * Глобальный снэкбар для отображения уведомлений.
 *
 * Компонент слушает состояние notification из Redux и при открытом флаге
 * отображает Snackbar с Alert внутри. Автоматически скрывается через 3 секунды
 * или при нажатии пользователем.
 */
export default function GlobalSnackbar() {
   const dispatch = useDispatch<AppDispatch>();
   // Извлекаем параметры уведомления из Redux
   const { open, message, severity } = useSelector(
      (state: RootState) => state.data.notification
   );

   // Обработчик закрытия снэкбара
   const handleClose = (
      _event?: React.SyntheticEvent | Event,
      reason?: string
   ) => {
      // Не закрываем при клике вне (clickaway)
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
         {/* Текстовое уведомление с цветом в зависимости от severity */}
         <Alert
            onClose={handleClose}
            severity={severity}
            elevation={6}
            variant="filled"
         >
            {message}
         </Alert>
      </Snackbar>
   );
}
