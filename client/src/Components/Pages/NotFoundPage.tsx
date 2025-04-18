// src/components/NotFoundPage.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
   const navigate = useNavigate();
   return (
      <Box
         sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            textAlign: 'center'
         }}
      >
         <Typography variant="h1" component="div" gutterBottom>
            404
         </Typography>
         <Typography variant="h5" gutterBottom>
            Ой… Такая страница не найдена
         </Typography>
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
