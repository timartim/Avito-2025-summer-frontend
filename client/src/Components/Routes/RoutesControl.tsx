// src/Components/Routes/RoutesControl.tsx

import React, { useState, useEffect } from 'react';
import {
   AppBar,
   Toolbar,
   Button,
   Box,
   CssBaseline,
   IconButton,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import RoutesConfig from './RoutesConfig';
import TaskDialog, { Task } from '../Dialogs/TaskDialog';
import GlobalLoading from '../Beauty/GlobalLoading';
import GlobalSnackbar from '../Beauty/GlobalSnackbar';
import SettingsDialog from '../Dialogs/SettingsDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import RestoreIcon from '@mui/icons-material/Restore';
import { fetchBoards, fetchTasks, fetchUsers } from '../ReduxSlices/dataSlice';
import { RootState } from '../ReduxStore/store';
import '../../Styles/ButtonStyles.css';
import DraftsDialog from '../Dialogs/DraftDialog.tsx';

export type ThemeMode = 'system' | 'light' | 'dark';

interface RoutesControlProps {
   mode: ThemeMode;
   onModeChange: (newMode: ThemeMode) => void;
}

export default function RoutesControl({ mode, onModeChange }: RoutesControlProps) {
   const dispatch = useDispatch();
   const [openTaskDialog, setOpenTaskDialog] = useState(false);
   const [openSettings, setOpenSettings] = useState(false);
   const [openDrafts, setOpenDrafts] = useState(false);
   const [drafts, setDrafts] = useState<Partial<Task>[]>(() => {
      try {
         return JSON.parse(localStorage.getItem('taskDialogDrafts') || '[]');
      } catch {
         return [];
      }
   });

   const [restoredDraft, setRestoredDraft] = useState<Partial<Task>>({});

   const isLoading = useSelector((state: RootState) => state.data.isLoading);
   const location = useLocation();

   useEffect(() => {
      dispatch(fetchBoards());
      dispatch(fetchUsers());
      dispatch(fetchTasks());
   }, [dispatch]);

   const handleTaskSubmit = (task: Task) => {
      console.log('Новая/отредактированная задача:', task);
      setOpenTaskDialog(false);
      // clear restored draft
      setRestoredDraft({});
   };

   const isBoardsButtonActive =
      location.pathname === '/boards' || location.pathname.startsWith('/board/');

   const handleRestoreDraft = (draft: Partial<Task>) => {
      setOpenDrafts(false);
      setRestoredDraft(draft);
   };

   const handleDeleteDraft = (index: number) => {
      const updated = drafts.filter((_, i) => i !== index);
      setDrafts(updated);
      localStorage.setItem('taskDialogDrafts', JSON.stringify(updated));
   };

   return (
      <Box sx={{ flexGrow: 1 }}>
         <CssBaseline />
         <GlobalLoading />
         <GlobalSnackbar />

         <AppBar position="static" elevation={1} color="default">
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
                  <Button
                     variant="contained"
                     color="primary"
                     component={NavLink}
                     to="/boards"
                     sx={{ m: 2 }}
                     className={`nav-button ${isBoardsButtonActive ? 'active' : ''}`}
                  >
                     Проекты
                  </Button>
               </Box>

               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                     variant="contained"
                     color="primary"
                     onClick={() => {
                        // new task (no draft)
                        setRestoredDraft({});
                        setOpenTaskDialog(true);
                     }}
                     className="simple-button"
                  >
                     Добавить задачу
                  </Button>

                  <IconButton
                     color="primary"
                     onClick={() => setOpenDrafts(true)}
                     sx={{ ml: 1 }}
                  >
                     <RestoreIcon />
                  </IconButton>

                  <IconButton
                     color="primary"
                     onClick={() => setOpenSettings(true)}
                     sx={{ ml: 1 }}
                  >
                     <SettingsIcon />
                  </IconButton>
               </Box>
            </Toolbar>
         </AppBar>

         <Box sx={{ width: '100vw', height: '100vh', p: 2 }}>
            {!isLoading && <RoutesConfig />}
         </Box>

         <TaskDialog
            open={openTaskDialog}
            onClose={() => {
               setOpenTaskDialog(false);
               setRestoredDraft({});
            }}
            mode="create"
            initialValues={restoredDraft}
            saveOnCancel={Object.keys(restoredDraft).length === 0}
            onSubmit={handleTaskSubmit}
         />


         <DraftsDialog
            open={openDrafts}
            drafts={drafts}
            onClose={() => setOpenDrafts(false)}
            onRestore={handleRestoreDraft}
            onDelete={handleDeleteDraft}
         />

         <SettingsDialog
            open={openSettings}
            mode={mode}
            onClose={() => setOpenSettings(false)}
            onChange={(newMode) => {
               onModeChange(newMode);
               setOpenSettings(false);
            }}
         />
      </Box>
   );
}
