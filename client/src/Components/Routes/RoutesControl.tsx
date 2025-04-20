// src/Components/Routes/RoutesControl.tsx

/**
 * Компонент верхнего уровня, отвечающий за маршрутизацию
 * и глобальные элементы интерфейса (AppBar, диалоги, загрузка, уведомления).
 *
 * Задачи:
 * - Шапка приложения (AppBar) с навигацией между списком задач и досок.
 * - Кнопки для добавления задачи, восстановления черновиков и открытия настроек.
 * - Динамическое измерение высоты AppBar для корректного отступа содержимого.
 * - Загрузка данных при старте (доски, пользователи, задачи).
 * - Глобальные индикатор загрузки и Snackbar для уведомлений.
 * - Рендеринг маршрутов в основной области (через RoutesConfig).
 * - Диалог создания/редактирования задачи (TaskDialog).
 * - Диалог работы с черновиками (DraftsDialog).
 * - Диалог настроек темы приложения (SettingsDialog).
 */

import React, { useState, useEffect, useRef } from 'react';
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
import TaskDialog from '../Dialogs/TaskDialog';
import GlobalLoading from '../Beauty/Global/GlobalLoading';
import GlobalSnackbar from '../Beauty/Global/GlobalSnackbar';
import SettingsDialog from '../Dialogs/SettingsDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import RestoreIcon from '@mui/icons-material/Restore';
import { fetchBoards, fetchTasks, fetchUsers } from '../../ReduxSlices/dataSlice';
import { RootState } from '../../ReduxStore/store';
import '../../Styles/ButtonStyles.css';
import DraftsDialog from '../Dialogs/DraftDialog';
import { Task } from '../../Interfaces/appInterfaces.ts';

export type ThemeMode = 'system' | 'light' | 'dark';

interface RoutesControlProps {
   mode: ThemeMode;
   onModeChange: (newMode: ThemeMode) => void;
}

export default function RoutesControl({ mode, onModeChange }: RoutesControlProps) {
   const dispatch = useDispatch();

   // Ref для измерения высоты AppBar
   const appBarRef = useRef<HTMLDivElement>(null);
   const [appBarHeight, setAppBarHeight] = useState(0);

   // Состояние диалогов и черновиков
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

   // При монтировании загружаем справочные данные
   useEffect(() => {
      dispatch(fetchBoards());
      dispatch(fetchUsers());
      dispatch(fetchTasks());
   }, [dispatch]);

   // Измерение и обновление высоты AppBar при изменении размера окна
   useEffect(() => {
      const measure = () => {
         if (appBarRef.current) {
            setAppBarHeight(appBarRef.current.offsetHeight);
         }
      };
      measure();
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
   }, []);

   // После отправки формы задачи закрываем диалог и сбрасываем черновик
   const handleTaskSubmit = () => {
      setOpenTaskDialog(false);
      setRestoredDraft({});
   };

   // Активная подсветка кнопки "Проекты" для соответствующих путей
   const isBoardsButtonActive =
      location.pathname === '/boards' || location.pathname.startsWith('/board/');

   // Восстановление выбранного черновика
   const handleRestoreDraft = (draft: Partial<Task>) => {
      setOpenDrafts(false);
      setRestoredDraft(draft);
   };

   // Удаление черновика из localStorage и состояния
   const handleDeleteDraft = (index: number) => {
      const updated = drafts.filter((_, i) => i !== index);
      setDrafts(updated);
      localStorage.setItem('taskDialogDrafts', JSON.stringify(updated));
   };

   return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
         <CssBaseline />
         <GlobalLoading />
         <GlobalSnackbar />

         {/* AppBar с меню навигации и кнопками */}
         <AppBar ref={appBarRef} elevation={1} color="default">
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
                  {/* Открыть диалог создания задачи */}
                  <Button
                     variant="contained"
                     color="primary"
                     onClick={() => {
                        setRestoredDraft({});
                        setOpenTaskDialog(true);
                     }}
                     className="simple-button"
                  >
                     Добавить задачу
                  </Button>

                  {/* Открыть диалог черновиков */}
                  <IconButton
                     color="primary"
                     className="simple-button"
                     onClick={() => setOpenDrafts(true)}
                     sx={{ ml: 1 }}
                  >
                     <RestoreIcon />
                  </IconButton>

                  {/* Открыть диалог настроек */}
                  <IconButton
                     color="primary"
                     className="simple-button"
                     onClick={() => setOpenSettings(true)}
                     sx={{ ml: 1 }}
                  >
                     <SettingsIcon />
                  </IconButton>
               </Box>
            </Toolbar>
         </AppBar>

         {/* Основной контент: маршруты отображаются после окончания глобальной загрузки */}
         <Box
            sx={{
               width: '100vw',
               flex: 1,
               overflow: 'auto',
               pt: `${appBarHeight}px`,
            }}
         >
            {!isLoading && <RoutesConfig />}
         </Box>

         {/* Диалог создания/редактирования задачи */}
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

         {/* Диалог черновиков */}
         <DraftsDialog
            open={openDrafts}
            drafts={drafts}
            onClose={() => setOpenDrafts(false)}
            onRestore={handleRestoreDraft}
            onDelete={handleDeleteDraft}
         />

         {/* Диалог настроек темы */}
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
