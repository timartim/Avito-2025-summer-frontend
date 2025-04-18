// src/Pages/AllBoards.tsx

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { NavLink } from 'react-router-dom';
import '../../Styles/ButtonStyles.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards, selectBoards, selectLoading, selectError } from '../ReduxSlices/dataSlice';
import type { AppDispatch, RootState } from '../ReduxStore/store';

export default function AllBoards() {
   const boards    = useSelector((state: RootState) => selectBoards(state));
   const error     = useSelector((state: RootState) => selectError(state));


   return (
      <Box sx={{ p: 2 }}>
         <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                     mb: 2,
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
