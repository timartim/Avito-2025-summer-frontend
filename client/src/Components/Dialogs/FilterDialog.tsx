import React, { useState, useMemo } from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   FormControl,
   FormLabel,
   FormGroup,
   FormControlLabel,
   Checkbox,
   Typography,
   Box,
   Paper,
   TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../ReduxStore/store';
import { Task } from './TaskDialog.tsx';
import { priorityRuToServer, statusRuToServer } from '../Pages/AllTasks.tsx';

interface FilterDialogProps {
   open: boolean;
   onClose: () => void;
   filterItems: Task[];
   setFilterItems: () => void;
   onApplyFilter: (filters: Filter) => void;
}
export interface Filter {
   priorities: string[];
   statuses: string[];
   boards: string[];
}

export default function FilterDialog({
                                        open,
                                        onClose,
                                        onApplyFilter,
                                     }: FilterDialogProps) {

   const boards = useSelector((state: RootState) => state.data.boards ?? []);

   const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
   const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
   const [searchBoard, setSearchBoard] = useState('');

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
         priorities: selectedPriorities.map(priority => priorityRuToServer[priority]),
         statuses: selectedStatuses.map(status => statusRuToServer[status]),
         boards: selectedBoards,
      });
   };

   return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
         <DialogTitle>Фильтры</DialogTitle>
         <DialogContent>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
               <FormControl component="fieldset" variant="standard" fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                     Приоритет
                  </FormLabel>
                  <FormGroup>
                     <FormControlLabel
                        control={
                           <Checkbox
                              name="Небольшое"
                              checked={selectedPriorities.includes('Небольшое')}
                              onChange={handlePriorityChange}
                           />
                        }
                        label="Небольшое"
                     />
                     <FormControlLabel
                        control={
                           <Checkbox
                              name="Среднее"
                              checked={selectedPriorities.includes('Среднее')}
                              onChange={handlePriorityChange}
                           />
                        }
                        label="Среднее"
                     />
                     <FormControlLabel
                        control={
                           <Checkbox
                              name="Высокое"
                              checked={selectedPriorities.includes('Высокое')}
                              onChange={handlePriorityChange}
                           />
                        }
                        label="Высокое"
                     />
                  </FormGroup>
               </FormControl>
            </Paper>


            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
               <FormControl component="fieldset" variant="standard" fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                     Статус
                  </FormLabel>
                  <FormGroup>
                     <FormControlLabel
                        control={
                           <Checkbox
                              name="Не начато"
                              checked={selectedStatuses.includes('Не начато')}
                              onChange={handleStatusChange}
                           />
                        }
                        label="Не начато"
                     />
                     <FormControlLabel
                        control={
                           <Checkbox
                              name="В процессе"
                              checked={selectedStatuses.includes('В процессе')}
                              onChange={handleStatusChange}
                           />
                        }
                        label="В процессе"
                     />
                     <FormControlLabel
                        control={
                           <Checkbox
                              name="Выполнено"
                              checked={selectedStatuses.includes('Выполнено')}
                              onChange={handleStatusChange}
                           />
                        }
                        label="Выполнено"
                     />
                  </FormGroup>
               </FormControl>
            </Paper>


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

         <Box
            sx={{
               display: 'flex',
               justifyContent: 'flex-end',
               gap: 1,
               px: 3,
               pb: 2,
            }}
         >
            <Button variant="outlined" onClick={onClose} color="primary">
               Отменить
            </Button>
            <Button variant="contained" onClick={handleApply} color="primary">
               Найти
            </Button>
         </Box>
      </Dialog>
   );
}
