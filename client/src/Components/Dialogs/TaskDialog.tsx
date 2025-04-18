// src/Dialogs/TaskDialog.tsx

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../ReduxStore/store';
import {
   createTask as createTaskThunk,
   updateTask as updateTaskThunk,
   selectLoading as selectDataLoading,
} from '../ReduxSlices/dataSlice';
import { Assignee, Board, Task } from '../../Interfaces/appInterfaces.ts';



interface TaskDialogProps {
   open: boolean;
   onClose: () => void;
   mode: 'edit' | 'create';
   initialValues: Partial<Task>;
   onSubmit: (task: Task) => void;
}

const priorityServerToRu: Record<string, string> = {
   High: 'Высокое',
   Medium: 'Среднее',
   Low: 'Небольшое',
};
const priorityRuToServer: Record<string, string> = {
   'Высокое': 'High',
   'Среднее': 'Medium',
   'Небольшое': 'Low',
};
const statusServerToRu: Record<string, string> = {
   Backlog: 'Не начато',
   InProgress: 'В процессе',
   Done: 'Выполнено',
};
const statusRuToServer: Record<string, string> = {
   'Не начато': 'Backlog',
   'В процессе': 'InProgress',
   'Выполнено': 'Done',
};

export default function TaskDialog({
                                      open,
                                      onClose,
                                      mode,
                                      initialValues,
                                      onSubmit,
                                   }: TaskDialogProps) {
   const dispatch = useDispatch<AppDispatch>();
   const loading = useSelector((state: RootState) => selectDataLoading(state));

   const assignees = useSelector((state: RootState) => state.data.users);
   const boards = useSelector((state: RootState) => state.data.boards);

   const [task, setTask] = useState<Partial<Task>>({});
   const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({});
   useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
         if (task.title || task.description || task.priority || task.assigneeId || task.boardId) {
            const drafts: Partial<Task>[] = JSON.parse(localStorage.getItem('taskDialogDrafts') || '[]');
            drafts.push({ ...task });
            localStorage.setItem('taskDialogDrafts', JSON.stringify(drafts));
         }
         e.preventDefault();
         e.returnValue = '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
         window.removeEventListener('beforeunload', handleBeforeUnload);
      };
   }, [task]);
   useEffect(() => {
      const mapped: Partial<Task> = { ...initialValues };
      if (mapped.assignee && mapped.assignee.id) {
         mapped.assigneeId = mapped.assignee.id;
      }
      if (mode === 'edit') {
         if (mapped.priority && priorityServerToRu[mapped.priority]) {
            mapped.priority = priorityServerToRu[mapped.priority];
         }
         if (mapped.status && statusServerToRu[mapped.status]) {
            mapped.status = statusServerToRu[mapped.status];
         }
      }
      if (mapped.assigneeId && !mapped.assignee) {
         const found = assignees.find(a => a.id === mapped.assigneeId);
         if (found) mapped.assignee = found;
      }
      setTask({
         ...mapped,
         boardName: mapped.boardName || '',
         boardId: mapped.boardId || 0,
      });
      setErrors({});
   }, [initialValues, open, mode, assignees]);

   const handleChange = (prop: keyof Task) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
         setTask(prev => ({ ...prev, [prop]: e.target.value }));
      };

   const handleAssigneeChange = (_: any, value: Assignee | null) => {
      setTask(prev => ({
         ...prev,
         assignee: value || ({} as Assignee),
         assigneeId: value ? value.id : 0,
      }));
   };

   const handleBoardChange = (_: any, value: Board | null) => {
      if (mode === 'create') {
         setTask(prev => ({
            ...prev,
            boardName: value ? value.name : '',
            boardId: value ? value.id : 0,
         }));
      }
   };

   const handlePriorityChange = (
      e: React.ChangeEvent<{ value: unknown }>,
   ) => {
      setTask(prev => ({ ...prev, priority: e.target.value as string }));
   };

   const handleStatusChange = (
      e: React.ChangeEvent<{ value: unknown }>,
   ) => {
      setTask(prev => ({ ...prev, status: e.target.value as string }));
   };

   const validate = (): typeof errors => {
      const newErrors: typeof errors = {};
      if (!task.title?.trim()) newErrors.title = 'Заголовок обязателен';
      if (!task.description?.trim()) newErrors.description = 'Описание обязательно';
      if (!task.assigneeId) newErrors.assigneeId = 'Выберите исполнителя';
      if (mode === 'create' && !task.boardId) newErrors.boardName = 'Выберите проект';
      if (!task.priority) newErrors.priority = 'Выберите приоритет';
      if (mode === 'edit' && !task.status) newErrors.status = 'Выберите статус';
      return newErrors;
   };


   const handleCancel = () => {
      onClose();
   };

   const handleSubmit = async () => {
      const newErrors = validate();
      if (Object.keys(newErrors).length) {
         setErrors(newErrors);
         return;
      }

      const boardName = boards.find(b => b.id === task.boardId)?.name || '';

      const serverPriority = priorityRuToServer[task.priority!] as string;
      if (mode === 'create') {
         const action = await dispatch(
            createTaskThunk({
               title: task.title!,
               description: task.description!,
               priority: serverPriority,
               assigneeId: task.assigneeId!,
               boardId: task.boardId!,
               boardName,
            }),
         );
         if (createTaskThunk.fulfilled.match(action)) {
            onSubmit({ ...action.payload, assignee: task.assignee!, boardName });
            onClose();
         }
      } else {
         const serverStatus = statusRuToServer[task.status!] as string;
         const action = await dispatch(
            updateTaskThunk({
               id: task.id!,
               title: task.title!,
               description: task.description!,
               priority: serverPriority,
               status: serverStatus,
               assigneeId: task.assigneeId!,
               boardId: task.boardId!,
               boardName,
            }),
         );
         if (updateTaskThunk.fulfilled.match(action)) {
            onSubmit({ ...action.payload, assignee: task.assignee!, boardName });
            onClose();
         }
      }
   };

   return (
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
         <DialogTitle sx={{ fontWeight: 'bold', fontSize: '25px' }}>
            {mode === 'create' ? 'Создать задачу' : 'Редактировать задачу'}
         </DialogTitle>
         <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
               <TextField
                  label="Заголовок"
                  value={task.title ?? ''}
                  onChange={handleChange('title')}
                  error={!!errors.title}
                  helperText={errors.title}
                  fullWidth
               />
               <TextField
                  label="Описание"
                  value={task.description ?? ''}
                  onChange={handleChange('description')}
                  error={!!errors.description}
                  helperText={errors.description}
                  fullWidth
                  multiline
               />
               <Autocomplete
                  options={assignees}
                  getOptionLabel={o => o.fullName}
                  value={assignees.find(a => a.id === task.assigneeId) || null}
                  onChange={handleAssigneeChange}
                  renderInput={params => (
                     <TextField
                        {...params}
                        label="Исполнитель"
                        error={!!errors.assigneeId}
                        helperText={errors.assigneeId}
                     />
                  )}
               />
               <FormControl fullWidth error={!!errors.priority}>
                  <InputLabel>Приоритет</InputLabel>
                  <Select
                     value={task.priority ?? ''}
                     onChange={handlePriorityChange}
                     label="Приоритет"
                  >
                     <MenuItem value="Небольшое">Небольшое</MenuItem>
                     <MenuItem value="Среднее">Среднее</MenuItem>
                     <MenuItem value="Высокое">Высокое</MenuItem>
                  </Select>
               </FormControl>
               {mode === 'edit' && (
                  <FormControl fullWidth error={!!errors.status}>
                     <InputLabel>Статус</InputLabel>
                     <Select
                        value={task.status ?? ''}
                        onChange={handleStatusChange}
                        label="Статус"
                     >
                        <MenuItem value="Не начато">Не начато</MenuItem>
                        <MenuItem value="В процессе">В процессе</MenuItem>
                        <MenuItem value="Выполнено">Выполнено</MenuItem>
                     </Select>
                  </FormControl>
               )}
               {mode === 'create' ? (
                  <Autocomplete
                     options={boards}
                     getOptionLabel={o => o.name}
                     value={boards.find(b => b.id === task.boardId) || null}
                     onChange={handleBoardChange}
                     renderInput={params => (
                        <TextField
                           {...params}
                           label="Проект"
                           error={!!errors.boardName}
                           helperText={errors.boardName}
                        />
                     )}
                  />
               ) : (
                  task.boardName &&
                  <TextField
                     label="Проект"
                     value={task.boardName}
                     disabled
                     fullWidth
                     error={!!errors.boardName}
                     helperText={errors.boardName}
                  />
               )}
            </Box>
         </DialogContent>
         <DialogActions>
            <Button
               onClick={handleCancel}
               disabled={loading}
               className="simple-button"
               variant="contained"
            >
               Отменить
            </Button>
            <Button
               onClick={handleSubmit}
               disabled={loading}
               className="simple-button"
               variant="contained"
            >
               {mode === 'create' ? 'Создать' : 'Сохранить'}
            </Button>
         </DialogActions>
      </Dialog>
   );
}
