// FilterDialog.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   Button,
   FormControl,
   FormLabel,
   FormGroup,
   FormControlLabel,
   Checkbox,
   Box,
   Paper,
   TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../ReduxStore/store';
import {
   priorityRuToServer,
   statusRuToServer,
   priorityServerToRu,
   statusServerToRu,
} from '../Pages/AllTasks.tsx';

export interface Filter {
   priorities: string[];
   statuses: string[];
   boards: string[];
}

interface FilterDialogProps {
   open: boolean;
   onClose: () => void;
   /**
    * Сохранённые значения из localStorage, приходят
    * из родительского компонента AllTasks.
    */
   initialValues: Filter;
   onApplyFilter: (filters: Filter) => void;
}

export default function FilterDialog({
                                        open,
                                        onClose,
                                        initialValues,
                                        onApplyFilter,
                                     }: FilterDialogProps) {
   const boards = useSelector((state: RootState) => state.data.boards ?? []);

   const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
   const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
   const [searchBoard, setSearchBoard] = useState<string>('');

   /*
    * ────────────────────────────────────────────────────────────────────────
    *  Синхронизация state с initialValues при открытии диалога.
    *  Переводим сохранённые значения (EN) в отображаемые (RU).
    * ────────────────────────────────────────────────────────────────────────
    */
   useEffect(() => {
      if (!open) return;
      setSelectedPriorities(
         (initialValues.priorities ?? []).map(
            (p) => priorityServerToRu[p] ?? p,
         ),
      );
      setSelectedStatuses(
         (initialValues.statuses ?? []).map(
            (s) => statusServerToRu[s] ?? s,
         ),
      );
      setSelectedBoards(initialValues.boards ?? []);
      setSearchBoard('');
   }, [open, initialValues]);

   /* ------------------------------------------------------------------- */

   const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setSelectedPriorities((prev) =>
         checked ? [...prev, name] : prev.filter((item) => item !== name),
      );
   };

   const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setSelectedStatuses((prev) =>
         checked ? [...prev, name] : prev.filter((item) => item !== name),
      );
   };

   const handleBoardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setSelectedBoards((prev) =>
         checked ? [...prev, name] : prev.filter((item) => item !== name),
      );
   };

   const filteredBoards = useMemo(() => {
      const lowerSearch = searchBoard.toLowerCase();
      return boards.filter((b) => b.name.toLowerCase().includes(lowerSearch));
   }, [boards, searchBoard]);

   const handleApply = () => {
      onApplyFilter({
         priorities: selectedPriorities.map(
            (priority) => priorityRuToServer[priority] ?? priority,
         ),
         statuses: selectedStatuses.map(
            (status) => statusRuToServer[status] ?? status,
         ),
         boards: selectedBoards,
      });
   };

   const handleReset = () => {
      const cleared: Filter = { priorities: [], statuses: [], boards: [] };
      setSelectedPriorities([]);
      setSelectedStatuses([]);
      setSelectedBoards([]);
   };

   /* ------------------------------------------------------------------- */

   return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
         <DialogTitle>Фильтры</DialogTitle>
         <DialogContent>
            {/* Приоритет */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
               <FormControl component="fieldset" variant="standard" fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                     Приоритет
                  </FormLabel>
                  <FormGroup>
                     {['Небольшое', 'Среднее', 'Высокое'].map((label) => (
                        <FormControlLabel
                           key={label}
                           control={
                              <Checkbox
                                 name={label}
                                 checked={selectedPriorities.includes(label)}
                                 onChange={handlePriorityChange}
                              />
                           }
                           label={label}
                        />
                     ))}
                  </FormGroup>
               </FormControl>
            </Paper>

            {/* Статус */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
               <FormControl component="fieldset" variant="standard" fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                     Статус
                  </FormLabel>
                  <FormGroup>
                     {['Не начато', 'В процессе', 'Выполнено'].map((label) => (
                        <FormControlLabel
                           key={label}
                           control={
                              <Checkbox
                                 name={label}
                                 checked={selectedStatuses.includes(label)}
                                 onChange={handleStatusChange}
                              />
                           }
                           label={label}
                        />
                     ))}
                  </FormGroup>
               </FormControl>
            </Paper>

            {/* Доски */}
            <Paper variant="outlined" sx={{ p: 2 }}>
               <FormControl component="fieldset" variant="standard" fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                     Доски
                  </FormLabel>

                  <TextField
                     label="Поиск доски"
                     variant="outlined"
                     size="small"
                     value={searchBoard}
                     onChange={(e) => setSearchBoard(e.target.value)}
                     sx={{ mb: 2 }}
                  />

                  <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                     <FormGroup>
                        {filteredBoards.map((board) => (
                           <FormControlLabel
                              key={board.id}
                              control={
                                 <Checkbox
                                    name={board.name}
                                    checked={selectedBoards.includes(board.name)}
                                    onChange={handleBoardChange}
                                 />
                              }
                              label={board.name}
                           />
                        ))}
                     </FormGroup>
                  </Box>
               </FormControl>
            </Paper>
         </DialogContent>

         <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: 3, pb: 2 }}>
            <Button variant="contained" onClick={handleReset} color="secondary" className='simple-button'>
               Сбросить
            </Button>
            <Button variant="contained" onClick={onClose} color="primary" className='simple-button'>
               Отменить
            </Button>
            <Button variant="contained" onClick={handleApply} color="primary">
               Найти
            </Button>
         </Box>
      </Dialog>
   );
}