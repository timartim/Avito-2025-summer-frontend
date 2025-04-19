// src/Hooks/useFilterDialog.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../ReduxStore/store';
import { Filter } from '../Interfaces/serviceInterfaces';
import { priorityOptions, statusOptions } from '../Constants/taskConstance.ts';

export function useFilterDialog(open: boolean, initial: Filter) {
   const boards = useSelector((s: RootState) => s.data.boards ?? []);
   const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
   const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
   const [searchBoard, setSearchBoard] = useState<string>('');

   useEffect(() => {
      if (!open) return;
      setSelectedPriorities(
         (initial.priorities ?? []).map(p =>
            priorityOptions.find(o => o.value === p)?.label ?? p
         )
      );
      setSelectedStatuses(
         (initial.statuses ?? []).map(s =>
            statusOptions.find(o => o.value === s)?.label ?? s
         )
      );
      setSelectedBoards(initial.boards ?? []);
      setSearchBoard('');
   }, [open, initial]);

   const filteredBoards = useMemo(
      () =>
         boards.filter(b =>
            b.name.toLowerCase().includes(searchBoard.toLowerCase())
         ),
      [boards, searchBoard]
   );

   const togglePriority = useCallback((label: string) => {
      setSelectedPriorities(prev =>
         prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
      );
   }, []);

   const toggleStatus = useCallback((label: string) => {
      setSelectedStatuses(prev =>
         prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
      );
   }, []);

   const toggleBoard = useCallback((name: string) => {
      setSelectedBoards(prev =>
         prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
      );
   }, []);

   const apply = useCallback(
      (onApply: (f: Filter) => void, close: () => void) => {
         onApply({
            priorities: selectedPriorities.map(
               p => priorityOptions.find(o => o.label === p)?.value ?? p
            ),
            statuses: selectedStatuses.map(
               s => statusOptions.find(o => o.label === s)?.value ?? s
            ),
            boards: selectedBoards,
         });
         close();
      },
      [selectedPriorities, selectedStatuses, selectedBoards]
   );

   const reset = useCallback(() => {
      setSelectedPriorities([]);
      setSelectedStatuses([]);
      setSelectedBoards([]);
   }, []);

   return {
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
   };
}
