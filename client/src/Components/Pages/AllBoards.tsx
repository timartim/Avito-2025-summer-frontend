// src/Pages/AllBoards.tsx

import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';
import '../../Styles/ButtonStyles.css';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../ReduxSlices/dataSlice';
import type { RootState } from '../../ReduxStore/store';

/**
 * Страница отображения всех досок.
 *
 * Получает список досок из Redux‑хранилища и рендерит их в виде карточек.
 * Каждая карточка содержит название доски и кнопку для перехода на страницу этой доски.
 */
export default function AllBoards() {
   // Список досок из состояния Redux
   const boards = useSelector((state: RootState) => selectBoards(state));

   return (
      <Box sx={{ p: 2 }}>
         {/* Контейнер со скроллируемым списком досок */}
         <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {boards.map(board => (
               <Paper
                  key={board.id}
                  sx={{
                     p: 2,
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     borderRadius: '16px',
                     boxShadow: 1,
                     mb: 2,
                  }}
               >
                  {/* Название доски */}
                  <Typography variant="h6">{board.name}</Typography>
                  {/* Кнопка навигации к конкретной доске */}
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
