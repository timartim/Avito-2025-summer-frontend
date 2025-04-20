// src/components/NotFoundPage.tsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Страница "404 Not Found".
 *
 * Отображает крупный код ошибки, поясняющее сообщение и кнопку для возврата
 * на главную страницу (в данном случае — на роут `/issues`).
 */
export default function NotFoundPage() {
   const navigate = useNavigate();

   return (
      <Box
         sx={{
            height: '100vh',                  // Занимает всю высоту экрана
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            textAlign: 'center'
         }}
      >
         {/* Код ошибки */}
         <Typography variant="h1" component="div" gutterBottom>
            404
         </Typography>

         {/* Поясняющее сообщение */}
         <Typography variant="h5" gutterBottom>
            Ой… Такая страница не найдена
         </Typography>

         {/* Кнопка возврата на главную */}
         <Button
            variant="contained"
            onClick={() => navigate('/issues')}
            sx={{ mt: 2 }}
         >
            Вернуться на главную
         </Button>
      </Box>
   );
}
