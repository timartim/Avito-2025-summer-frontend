import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { getBoards, Board } from '../Api/boardRequests.ts'; // Проверьте корректность пути
import '../../Styles/ButtonStyles.css';

export default function AllBoards() {
   const [boards, setBoards] = useState<Board[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string>('');

   useEffect(() => {
      getBoards()
         .then((data) => {
            setBoards(data);
            setError('');
         })
         .catch((err) => {
            console.error('Ошибка загрузки досок:', err);
            setError('Ошибка загрузки досок');
         })
         .finally(() => {
            setLoading(false);
         });
   }, []);

   if (loading) {
      return (
         <Box sx={{ p: 2, textAlign: 'center' }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return (
         <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
         </Box>
      );
   }

   return (
      <Box sx={{ p: 2 }}>
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {boards.map((board) => (
               <Paper
                  key={board.id}
                  sx={{
                     p: 2,
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     borderRadius: '16px',
                     boxShadow: 1,
                  }}
               >
                  <Typography variant="h6">{board.name}</Typography>
                  <Button
                     variant="contained"
                     color="primary"
                     component={NavLink}
                     to={`/board/${board.id}`}
                     className="nav-button"
                  >
                     Перейти
                  </Button>
               </Paper>
            ))}
         </Box>
      </Box>
   );
}
