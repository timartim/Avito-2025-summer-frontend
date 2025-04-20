// src/Components/Dialogs/DraftsDialog.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   Box,
   List,
} from '@mui/material';
import TaskDialog from '../Dialogs/TaskDialog';
import { useTaskDrafts } from '../../Hooks/useTaskDrafts';
import { DraftItem } from '../Beauty/Draft/DraftItem';
import { Task } from '../../Interfaces/appInterfaces';

interface DraftsDialogProps {
   open: boolean;
   onClose: () => void;
   onRestore: (task: Task) => void;
}

/**
 * Диалоговое окно для работы с черновиками задач.
 * - Загружает список черновиков через хук useTaskDrafts.
 * - Позволяет удалять и восстанавливать отдельные черновики.
 * - При восстановлении открывает TaskDialog для доработки и создания новой задачи.
 */
export default function DraftsDialog({
                                        open,
                                        onClose,
                                        onRestore,
                                     }: DraftsDialogProps) {
   const { drafts, load, remove } = useTaskDrafts();
   const [openTask, setOpenTask] = useState(false);
   const [selected, setSelected] = useState<{
      draft: Partial<Task>;
      index: number;
   } | null>(null);

   // При открытии диалога загружаем черновики
   useEffect(() => {
      if (open) load();
   }, [open, load]);

   // Удаление черновика по индексу
   const handleDelete = useCallback((idx: number) => {
      remove(idx);
   }, [remove]);

   // Восстановление черновика: закрываем список, открываем TaskDialog
   const handleRestore = useCallback(
      (draft: Partial<Task>, idx: number) => {
         onClose();
         setSelected({ draft, index: idx });
         setOpenTask(true);
      },
      [onClose]
   );

   // Закрытие TaskDialog без сохранения
   const handleTaskClose = useCallback(() => {
      setOpenTask(false);
      setSelected(null);
      load(); // обновляем список после закрытия
   }, [load]);

   // Обработка создания задачи: вызываем onRestore, удаляем черновик
   const handleTaskSubmit = useCallback(
      (created: Task) => {
         onRestore(created);
         if (selected) remove(selected.index);
         setOpenTask(false);
         setSelected(null);
      },
      [onRestore, remove, selected]
   );

   return (
      <>
         <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ style: { minHeight: '60vh', maxHeight: '80vh' } }}
         >
            <DialogTitle>Черновики задач</DialogTitle>
            <DialogContent dividers>
               {drafts.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                     Нет сохранённых черновиков.
                  </Box>
               ) : (
                  <List>
                     {drafts.map((d, idx) => (
                        <DraftItem
                           key={idx}
                           draft={d}
                           index={idx}
                           onRestore={handleRestore}
                           onDelete={handleDelete}
                        />
                     ))}
                  </List>
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={onClose} variant="contained" className='simple-button'>
                  Закрыть
               </Button>
            </DialogActions>
         </Dialog>

         {selected && (
            <TaskDialog
               open={openTask}
               onClose={handleTaskClose}
               mode="create"
               initialValues={selected.draft}
               onSubmit={handleTaskSubmit}
            />
         )}
      </>
   );
}
