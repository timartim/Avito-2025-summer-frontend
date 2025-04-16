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
import { createTask, updateTask } from '../Api/taskRequests';
import { RootState } from '../ReduxStore/store';
import { useSelector } from 'react-redux';
import { Board, Assignee } from '../ReduxSlices/dataSlice';

export interface Task {
   id?: number;
   title: string;
   description: string;
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | string;
   status: 'Не начато' | 'В процессе' | 'Выполнено' | string;
   assigneeId: number;
   assignee: Assignee;
   boardName: string;
   boardId: number;
}

interface TaskDialogProps {
   open: boolean;
   onClose: () => void;
   mode: 'edit' | 'create';
   initialValues: Partial<Task>;
   onSubmit: (task: Task) => void;
}

interface Errors {
   title?: string;
   description?: string;
   assigneeId?: string;
   boardName?: string;
   priority?: string;
   status?: string;
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
   const [task, setTask] = useState<Partial<Task>>({});
   const [submitting, setSubmitting] = useState(false);
   const [errors, setErrors] = useState<Errors>({});

   const assignees = useSelector((state: RootState) => state.data.users ?? []);
   const boards = useSelector((state: RootState) => state.data.boards ?? []);

   useEffect(() => {
      const mapped = { ...initialValues };
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
      setTask(mapped);
      setErrors({});
   }, [initialValues, open, mode, assignees]);

   const handleChange = (prop: keyof Task) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

   const handlePriorityChange = (e: React.ChangeEvent<{ value: unknown }>) => {
      setTask(prev => ({ ...prev, priority: e.target.value as string }));
   };

   const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
      setTask(prev => ({ ...prev, status: e.target.value as string }));
   };

   const validate = (): Errors => {
      const newErrors: Errors = {};
      if (!task.title || !task.title.trim()) newErrors.title = 'Заголовок обязателен';
      if (!task.description || !task.description.trim()) newErrors.description = 'Описание обязательно';
      if (!task.assigneeId || task.assigneeId === 0) newErrors.assigneeId = 'Выберите исполнителя';
      if (mode === 'create' && (!task.boardId || task.boardId === 0)) newErrors.boardName = 'Выберите проект';
      if (mode === 'edit' && (!task.boardName || !task.boardName.trim())) newErrors.boardName = 'Выберите проект';
      if (!task.priority || !task.priority.trim()) newErrors.priority = 'Выберите приоритет';
      if (mode === 'edit' && (!task.status || !task.status.trim())) newErrors.status = 'Выберите статус';
      return newErrors;
   };

   const handleSubmit = async () => {
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
      }
      setSubmitting(true);
      try {
         const finalPriority = priorityRuToServer[task.priority ?? ''] ?? task.priority ?? 'Medium';
         let finalStatus = '';
         if (mode === 'edit' && task.status) {
            finalStatus = statusRuToServer[task.status] ?? task.status;
         }
         if (mode === 'create') {
            const input = {
               assigneeId: task.assigneeId ?? 0,
               boardId: task.boardId ?? 0,
               description: task.description ?? '',
               priority: finalPriority,
               title: task.title ?? '',
            };
            const result = await createTask(input);
            console.log('Создана задача:', result.id);
         } else if (mode === 'edit' && task.id) {
            const input = {
               assigneeId: task.assignee?.id ?? 0,
               description: task.description ?? '',
               priority: finalPriority,
               status: finalStatus || 'Backlog',
               title: task.title ?? '',
            };
            const result = await updateTask(task.id, input);
            console.log('Обновлена задача:', result.message);
         }
         onSubmit({ ...task, priority: finalPriority, status: finalStatus } as Task);
         onClose();
      } catch (err) {
         console.error('Ошибка при сохранении задачи:', err);
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
         <DialogTitle>{mode === 'create' ? 'Создать задачу' : 'Редактировать задачу'}</DialogTitle>
         <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
               <TextField
                  label="Заголовок"
                  value={task.title ?? ''}
                  onChange={handleChange('title')}
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  label="Описание"
                  value={task.description ?? ''}
                  onChange={handleChange('description')}
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                  fullWidth
                  multiline
                  variant="outlined"
               />
               <Autocomplete
                  options={assignees}
                  getOptionLabel={(option: Assignee) => option.fullName}
                  value={assignees.find(a => a.id === (task.assignee?.id ?? task.assigneeId ?? 0)) || null}
                  onChange={handleAssigneeChange}
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        label="Исполнитель"
                        error={Boolean(errors.assigneeId)}
                        helperText={errors.assigneeId}
                        variant="outlined"
                     />
                  )}
               />

               <FormControl fullWidth error={Boolean(errors.priority)}>
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
                  <FormControl fullWidth error={Boolean(errors.status)}>
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
                     getOptionLabel={(option: Board) => option.name}
                     value={boards.find(b => b.id === (task.boardId ?? 0)) || null}
                     onChange={handleBoardChange}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           label="Проект"
                           error={Boolean(errors.boardName)}
                           helperText={errors.boardName}
                           variant="outlined"
                        />
                     )}
                     ListboxProps={{
                        style: {
                           maxHeight: 200,
                           overflow: 'auto',
                        },
                     }}
                  />

               ) : (
                  <TextField
                     label="Проект"
                     value={task.boardName ?? ''}
                     disabled
                     fullWidth
                     variant="outlined"
                     error={Boolean(errors.boardName)}
                     helperText={errors.boardName}
                  />
               )}
            </Box>
         </DialogContent>
         <DialogActions>
            <Button variant="contained" className="simple-button" onClick={onClose} disabled={submitting}>
               Отменить
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
               {mode === 'create' ? 'Создать' : 'Сохранить'}
            </Button>
         </DialogActions>
      </Dialog>
   );
}
