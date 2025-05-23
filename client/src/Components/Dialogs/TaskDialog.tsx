// src/Dialogs/TaskDialog.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   TextField,
   Autocomplete,
   Box,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Avatar, FormHelperText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../ReduxStore/store';
import {
   createTask as createTaskThunk,
   updateTask as updateTaskThunk,
   selectLoading as selectDataLoading,
   selectUsers,
   selectBoards,
} from '../../ReduxSlices/dataSlice';
import { Task } from '../../Interfaces/appInterfaces';
import { prioritiesStatusesToRu, prioritiesStatusesToServer } from '../Constants/taskMapping.ts';
import { PRIORITY_LABELS, STATUS_LABELS } from '../Constants/taskConstance.ts';



/**
 * Диалог создания или редактирования задачи.
 *
 * Props:
 *  - open: флаг открытия диалога.
 *  - onClose: функция закрытия.
 *  - mode: режим 'create' или 'edit'.
 *  - initialValues: начальные значения задачи.
 *  - onSubmit: вызывается после успешного сохранения задачи.
 */
export default function TaskDialog({
                                      open,
                                      onClose,
                                      mode,
                                      initialValues,
                                      onSubmit,
                                   }: {
   open: boolean;
   onClose: () => void;
   mode: 'create' | 'edit';
   initialValues: Partial<Task>;
   onSubmit: (task: Task) => void;
}) {
   const dispatch = useDispatch<AppDispatch>();
   const loading = useSelector(selectDataLoading);
   const users = useSelector(selectUsers);
   const boards = useSelector(selectBoards);

   const [task, setTask] = useState<Partial<Task>>({});
   const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({});

   // Сохраняем незавершённый черновик при уходе со страницы
   useEffect(() => {
      const saveDraft = (e: BeforeUnloadEvent) => {
         if (task.title || task.description || task.priority || task.assigneeId || task.boardId) {
            const drafts = JSON.parse(localStorage.getItem('taskDialogDrafts') || '[]');
            drafts.push(task);
            localStorage.setItem('taskDialogDrafts', JSON.stringify(drafts));
         }
         e.preventDefault();
         e.returnValue = '';
      };
      window.addEventListener('beforeunload', saveDraft);
      return () => window.removeEventListener('beforeunload', saveDraft);
   }, [task]);

   // При открытии диалога заполняем форму начальными значениями
   useEffect(() => {
      if (!open) return;
      const m: Partial<Task> = { ...initialValues };

      // Устанавливаем assignee и конвертируем при необходимости
      if (m.assignee?.id) m.assigneeId = m.assignee.id;
      else if (m.assigneeId) {
         const user = users.find(u => u.id === m.assigneeId);
         if (user) m.assignee = user;
      }
      // Для режима редактирования конвертируем серверные коды в русские метки
      if (mode === 'edit') {
         if (m.priority && prioritiesStatusesToRu.priority[m.priority]) m.priority = prioritiesStatusesToRu.priority[m.priority];
         if (m.status && prioritiesStatusesToRu.status[m.status]) m.status = prioritiesStatusesToRu.status[m.status];
      }

      setTask({
         id: m.id!,
         title: m.title || '',
         description: m.description || '',
         assignee: m.assignee,
         assigneeId: m.assigneeId || 0,
         priority: m.priority || '',
         status: m.status || '',
         boardName: m.boardName || '',
         boardId: m.boardId || 0,
      });
      setErrors({});
   }, [open, initialValues, mode, users]);

   // Утилита обновления поля формы
   const handleField = useCallback(
      <K extends keyof Task>(field: K, value: any) => {
         setTask(prev => ({ ...prev, [field]: value }));
      },
      []
   );

   // Валидация полей перед сохранением
   const validate = useCallback(() => {
      const errs: Partial<Record<keyof Task, string>> = {};
      if (!task.title?.trim()) errs.title = 'Заголовок обязателен';
      if (!task.description?.trim()) errs.description = 'Описание обязательно';
      if (!task.assigneeId) errs.assigneeId = 'Выберите исполнителя';
      if (mode === 'create' && !task.boardId) errs.boardName = 'Выберите проект';
      if (!task.priority) errs.priority = 'Выберите приоритет';
      if (mode === 'edit' && !task.status) errs.status = 'Выберите статус';
      return errs;
   }, [task, mode]);

   // Отправка формы: создаём или обновляем задачу через Redux Thunk
   const submit = useCallback(async () => {
      const errs = validate();
      if (Object.keys(errs).length) {
         setErrors(errs);
         return;
      }

      const board = boards.find(b => b.name === task.boardName);
      const priority = prioritiesStatusesToServer.priority[task.priority!]!;

      if (mode === 'create') {
         const action = await dispatch(
            createTaskThunk({
               title: task.title,
               description: task.description,
               priority,
               assigneeId: task.assigneeId,
               boardId: board.id,
               boardName: board.name,
            })
         );
         if (createTaskThunk.fulfilled.match(action)) {
            onSubmit({ ...action.payload, assignee: task.assignee!, boardName: board.name });
            onClose();
         }
      } else {
         const status = prioritiesStatusesToServer.status[task.status!]!;
         const action = await dispatch(
            updateTaskThunk({
               id: task.id!,
               title: task.title!,
               description: task.description!,
               priority,
               status,
               assigneeId: task.assigneeId!,
               boardId: board.boardId!,
               boardName: task.boardName,
            })
         );
         if (updateTaskThunk.fulfilled.match(action)) {
            onSubmit({ ...action.payload, assignee: task.assignee!, boardName: board.name });
            onClose();
         }
      }
   }, [dispatch, task, boards, mode, onSubmit, onClose, validate]);

   return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
         <DialogTitle sx={{ fontWeight: 'bold', fontSize: 25 }}>
            {mode === 'create' ? 'Создать задачу' : 'Редактировать задачу'}
         </DialogTitle>
         <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
               {/* Поля ввода заголовка и описания */}
               <TextField
                  label="Заголовок"
                  value={task.title || ''}
                  onChange={e => handleField('title', e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  fullWidth
               />
               <TextField
                  label="Описание"
                  value={task.description || ''}
                  onChange={e => handleField('description', e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                  fullWidth
                  multiline
               />
               {/* Выбор исполнителя */}
               <Autocomplete
                  options={users}
                  getOptionLabel={u => u.fullName}
                  value={users.find(u => u.id === task.assigneeId) || null}
                  onChange={(_, v) => {
                     handleField('assignee',  v || undefined);
                     handleField('assigneeId', v?.id || 0);
                  }}
                  renderOption={(props, opt) => (
                     <Box component="li" {...props} key={opt.id} display="flex" alignItems="center">
                        {opt.fullName}
                        {opt.avatarUrl && (
                           <Avatar src={opt.avatarUrl} sx={{ width: 24, height: 24, ml: 'auto' }} />
                        )}
                     </Box>
                  )}

                  /* ⬇️ кастомизируем сам input */
                  renderInput={params => {
                     /** выбранный пользователь (если есть) */
                     const sel = users.find(u => u.id === task.assigneeId);
                     return (
                        <TextField
                           {...params}
                           label="Исполнитель"
                           error={!!errors.assigneeId}
                           helperText={errors.assigneeId}
                           fullWidth
                           InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                 <>
                                    {sel?.avatarUrl && (
                                       <Avatar
                                          src={sel.avatarUrl}
                                          sx={{ width: 24, height: 24, mr: 1 }}
                                       />
                                    )}
                                    {params.InputProps.endAdornment }
                                 </>
                              ),
                           }}
                        />
                     );
                  }}
                  ListboxProps={{ sx: { maxHeight: 240, overflowY: 'auto' } }}
               />
               {/* Выбор приоритета */}
               <FormControl fullWidth error={!!errors.priority}>
                  <InputLabel>Приоритет</InputLabel>
                  <Select
                     value={task.priority || ''}
                     onChange={e => handleField('priority', e.target.value)}
                     label="Приоритет"
                  >
                     {PRIORITY_LABELS.map(label => (
                        <MenuItem key={label} value={label}>{label}</MenuItem>
                     ))}
                  </Select>
                  <FormHelperText>{errors.priority}</FormHelperText>
               </FormControl>
               {/* Выбор статуса (только в режиме редактирования) */}
               {mode === 'edit' && (
                  <FormControl fullWidth error={!!errors.status}>
                     <InputLabel>Статус</InputLabel>
                     <Select
                        value={task.status || ''}
                        onChange={e => handleField('status', e.target.value)}
                        label="Статус"
                     >
                        {STATUS_LABELS.map(label => (
                           <MenuItem key={label} value={label}>{label}</MenuItem>
                        ))}
                     </Select>
                  </FormControl>
               )}
               {/* Выбор проекта (или просто отображение в режиме edit) */}
               {mode === 'create' ? (
                  <Autocomplete
                     options={boards}
                     getOptionLabel={b => b.name}
                     value={boards.find(b => b.id === task.boardId) || null}
                     onChange={(_, v) => {
                        handleField('boardName', v?.name || '');
                        handleField('boardId', v?.id || 0);
                     }}
                     renderInput={params => (
                        <TextField
                           {...params}
                           label="Проект"
                           error={!!errors.boardName}
                           helperText={errors.boardName}
                           fullWidth
                        />
                     )}
                     ListboxProps={{ sx: { maxHeight: 240, overflowY: 'auto' } }}
                  />
               ) : (
                  task.boardName && (
                     <TextField
                        label="Проект"
                        value={task.boardName}
                        disabled
                        fullWidth
                        error={!!errors.boardName}
                        helperText={errors.boardName}
                     />
                  )
               )}
            </Box>
         </DialogContent>
         <DialogActions>
            {/* Кнопки отмены и сохранения */}
            <Button onClick={onClose} disabled={loading} variant="contained">Отменить</Button>
            <Button onClick={submit} disabled={loading} variant="contained">
               {mode === 'create' ? 'Создать' : 'Сохранить'}
            </Button>
         </DialogActions>
      </Dialog>
   );
}
