import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, CssBaseline } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUsers, setBoards } from '../ReduxSlices/dataSlice';
import { getUsers } from '../Api/userRequests.ts';
import { getBoards } from '../Api/boardRequests.ts';
import RoutesConfig from './RoutesConfig';
import TaskDialog, { Task } from '../Dialogs/TaskDialog';
import '../../Styles/ButtonStyles.css';

function RoutesControl() {
   const dispatch = useDispatch();
   const [openTaskDialog, setOpenTaskDialog] = useState(false);
   const location = useLocation();
   const initialTaskValues: Task = {
      title: '',
      description: '',
      priority: 'Среднее',
      status: '',
      assigneeId: 0,
      boardId: 0,
   };

   useEffect(() => {
      getUsers()
         .then((users) => {
            dispatch(setUsers(users));
         })
         .catch((err) => {
            console.error('Ошибка загрузки пользователей:', err);
         });

      getBoards()
         .then((boards) => {
            dispatch(setBoards(boards));
         })
         .catch((err) => {
            console.error('Ошибка загрузки досок:', err);
         });
   }, [dispatch]);

   const handleTaskSubmit = (task: Task) => {
      console.log('Новая/отредактированная задача:', task);
      setOpenTaskDialog(false);
   };


   const isBoardsButtonActive =
      location.pathname === '/boards' || location.pathname.startsWith('/board/');

   return (
      <Box sx={{ flexGrow: 1 }}>
         <CssBaseline />
         <Box sx={{ boxShadow: 1, width: '100%' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
               <Box>
                  <Button
                     variant="contained"
                     color="primary"
                     component={NavLink}
                     to="/issues"
                     sx={{ m: 2 }}
                     className="nav-button"
                  >
                     Все задачи
                  </Button>

                  {/* Кнопка "Проекты" */}
                  <Button
                     variant="contained"
                     color="primary"
                     component={NavLink}
                     to="/boards"
                     className={`nav-button ${isBoardsButtonActive ? 'active' : ''}`}
                     sx={{ m: 2 }}
                  >
                     Проекты
                  </Button>
               </Box>

               <Box>
                  <Button
                     variant="contained"
                     color="primary"
                     onClick={() => setOpenTaskDialog(true)}
                     className="simple-button"
                  >
                     Добавить задачу
                  </Button>
               </Box>
            </Toolbar>
         </Box>

         <Box sx={{ width: '100vw', height: '100vh', p: 2 }}>
            <RoutesConfig />
         </Box>

         <TaskDialog
            open={openTaskDialog}
            onClose={() => setOpenTaskDialog(false)}
            mode="create"
            initialValues={initialTaskValues}
            onSubmit={handleTaskSubmit}
         />
      </Box>
   );
}

export default RoutesControl;
