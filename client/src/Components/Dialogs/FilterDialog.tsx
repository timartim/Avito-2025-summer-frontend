// src/Pages/FilterDialog.tsx

import React from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   Button,
   Box,
} from '@mui/material';
import { useFilterDialog } from '../../Hooks/useFilterDialog';
import { FilterGroup } from '../Beauty/Filter/FilterGroup';
import { BoardFilter } from '../Beauty/Filter/BoardFilter';
import { Filter } from '../../Interfaces/serviceInterfaces';

interface FilterDialogProps {
   open: boolean;
   onClose: () => void;
   initialValues: Filter;
   onApplyFilter: (f: Filter) => void;
}

/**
 * Окно фильтрации задач по приоритетам, статусам и доскам.
 *
 * Props:
 *  - open: показывает или скрывает диалог.
 *  - onClose: вызывается при закрытии окна.
 *  - initialValues: начальные значения фильтра.
 *  - onApplyFilter: колбэк для применения выбранных фильтров.
 */
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
            {/* Группа фильтров по приоритетам */}
            <FilterGroup
               legend="Приоритет"
               options={priorityOptions}
               selected={selectedPriorities}
               onToggle={togglePriority}
            />
            {/* Группа фильтров по статусам */}
            <FilterGroup
               legend="Статус"
               options={statusOptions}
               selected={selectedStatuses}
               onToggle={toggleStatus}
            />
            {/* Фильтр по доскам с поиском */}
            <BoardFilter
               filteredBoards={filteredBoards}
               search={searchBoard}
               onSearch={setSearchBoard}
               selected={selectedBoards}
               onToggle={toggleBoard}
            />
         </DialogContent>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2 }}>
            {/* Сброс всех фильтров */}
            <Button variant="contained" color="secondary" className="simple-button" onClick={reset}>
               Сбросить
            </Button>
            {/* Закрыть без применения */}
            <Button variant="contained" onClick={onClose} className="simple-button">
               Отменить
            </Button>
            {/* Применить выбранные фильтры */}
            <Button
               variant="contained"
               onClick={() => apply(onApplyFilter, onClose)}
               className="simple-button"
            >
               Найти
            </Button>
         </Box>
      </Dialog>
   );
}
