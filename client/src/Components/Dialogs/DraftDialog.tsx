// src/Components/Dialogs/DraftsDialog.tsx

import React, { useState, useEffect } from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   Box,
   List,
   ListItem,
   ListItemText,
   ListItemSecondaryAction,
   IconButton,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskDialog, { Task } from '../Dialogs/TaskDialog';

interface DraftsDialogProps {
   open: boolean;
   onClose: () => void;
   onRestore: (task: Task) => void;
}

export default function DraftsDialog({
                                        open,
                                        onClose,
                                        onRestore,
                                     }: DraftsDialogProps) {
   const [drafts, setDrafts] = useState<Partial<Task>[]>([]);
   const [openTask, setOpenTask] = useState(false);
   const [selectedDraft, setSelectedDraft] = useState<Partial<Task> | null>(null);
   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

   const loadDrafts = () => {
      try {
         const saved = JSON.parse(
            localStorage.getItem('taskDialogDrafts') || '[]'
         ) as Partial<Task>[];
         setDrafts(saved);
      } catch {
         setDrafts([]);
      }
   };

   useEffect(() => {
      if (open) loadDrafts();
   }, [open]);

   const handleDelete = (idx: number) => {
      const updated = drafts.filter((_, i) => i !== idx);
      setDrafts(updated);
      localStorage.setItem('taskDialogDrafts', JSON.stringify(updated));
   };

   const handleRestoreClick = (draft: Partial<Task>, idx: number) => {
      onClose();
      setSelectedDraft(draft);
      setSelectedIndex(idx);
      setOpenTask(true);
   };

   const handleTaskClose = () => {
      setOpenTask(false);
      setSelectedDraft(null);
      setSelectedIndex(null);
      loadDrafts();
   };

   const handleTaskSubmit = (created: Task) => {
      onRestore(created);
      if (selectedIndex !== null) {
         handleDelete(selectedIndex);
      }
      setOpenTask(false);
      setSelectedDraft(null);
      setSelectedIndex(null);
   };

   const handleClose = () => {
      setSelectedDraft(null);
      setSelectedIndex(null);
      loadDrafts();
      onClose();
   };

   return (
      <>
         <Dialog
            open={open}
            onClose={handleClose}
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
                        <ListItem key={idx} divider>
                           <ListItemText
                              primary={d.title || `без названия ${idx + 1}`}
                              secondary={
                                 d.description
                                    ? d.description.substring(0, 100) + '…'
                                    : ''
                              }
                           />
                           <ListItemSecondaryAction>
                              <IconButton
                                 edge="end"
                                 onClick={() => handleRestoreClick(d, idx)}
                              >
                                 <RestoreIcon />
                              </IconButton>
                              <IconButton edge="end" onClick={() => handleDelete(idx)}>
                                 <DeleteIcon />
                              </IconButton>
                           </ListItemSecondaryAction>
                        </ListItem>
                     ))}
                  </List>
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} variant="contained">
                  Закрыть
               </Button>
            </DialogActions>
         </Dialog>

         {selectedDraft && (
            <TaskDialog
               open={openTask}
               onClose={handleTaskClose}
               mode="create"
               initialValues={selectedDraft}
               onSubmit={handleTaskSubmit}

            />
         )}
      </>
   );
}
