// src/Pages/FilterDialog.tsx
import React from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   Button,
   Box,
} from '@mui/material';
import { useFilterDialog } from '../Hooks/useFilterDialog';
import { FilterGroup } from '../Beauty/FilterGroup';
import { BoardFilter } from '../Beauty/BoardFilter';
import { Filter } from '../Interfaces/serviceInterfaces';

interface FilterDialogProps {
   open: boolean;
   onClose: () => void;
   initialValues: Filter;
   onApplyFilter: (f: Filter) => void;
}

export default function FilterDialog({
                                        open,
                                        onClose,
                                        initialValues,
                                        onApplyFilter,
                                     }: FilterDialogProps) {
   const {
      priorityOptions,
      statusOptions,
      selectedPriorities,
      selectedStatuses,
      selectedBoards,
      searchBoard,
      filteredBoards,
      setSearchBoard,
      togglePriority,
      toggleStatus,
      toggleBoard,
      apply,
      reset,
   } = useFilterDialog(open, initialValues);

   return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
         <DialogTitle sx={{ fontSize: 25, fontWeight: 'bold' }}>
            Фильтры
         </DialogTitle>
         <DialogContent>
            <FilterGroup
               legend="Приоритет"
               options={priorityOptions}
               selected={selectedPriorities}
               onToggle={togglePriority}
            />
            <FilterGroup
               legend="Статус"
               options={statusOptions}
               selected={selectedStatuses}
               onToggle={toggleStatus}
            />
            <BoardFilter
               boards={filteredBoards}
               filteredBoards={filteredBoards}
               search={searchBoard}
               onSearch={setSearchBoard}
               selected={selectedBoards}
               onToggle={toggleBoard}
            />
         </DialogContent>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2 }}>
            <Button variant='contained' color='secondary' className={'simple-button'} onClick={reset}>Сбросить</Button>
            <Button variant='contained' onClick={onClose} className={'simple-button'}>Отменить</Button>
            <Button variant='contained' onClick={() => apply(onApplyFilter, onClose)} className={'simple-button'}>Найти</Button>
         </Box>
      </Dialog>
   );
}
