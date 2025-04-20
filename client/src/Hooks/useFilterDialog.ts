// src/Hooks/useFilterDialog.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../ReduxStore/store.ts';
import { Filter } from '../Interfaces/serviceInterfaces.ts';
import { priorityOptions, statusOptions } from '../Components/Constants/taskConstance.ts';

/**
 * Хук для управления состоянием фильтров задач во вложенном диалоге.
 *
 * При открытии диалога (open=true) инициализирует внутренние состояния
 * на основе переданных initial.priorities, initial.statuses и initial.boards.
 * Также сбрасывает строку поиска досок.
 *
 * @param open Флаг открытия диалога фильтрации
 * @param initial Начальные значения фильтров
 * @returns Набор свойств и методов для управления фильтрами:
 *   - priorityOptions: список приоритетов для отображения
 *   - statusOptions: список статусов для отображения
 *   - selectedPriorities, selectedStatuses, selectedBoards: текущий выбор
 *   - searchBoard: строка поиска по доскам
 *   - filteredBoards: доски, отфильтрованные по searchBoard
 *   - setSearchBoard: установить строку поиска
 *   - togglePriority, toggleStatus, toggleBoard: переключатели выбора фильтра
 *   - apply: применить фильтр и вызвать колбэки onApply + close
 *   - reset: сбросить все выбранные фильтры
 */
export function useFilterDialog(open: boolean, initial: Filter) {
   // Список всех досок из хранилища
   const boards = useSelector((s: RootState) => s.data.boards ?? []);

   // Локальные состояния для выбранных опций
   const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
   const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
   // Строка поиска по названиям досок
   const [searchBoard, setSearchBoard] = useState<string>('');

   // При открытии диалога инициализируем выбор по первоначальным значениям
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

   // Доски, отфильтрованные по введённой строке поиска
   const filteredBoards = useMemo(
      () =>
         boards.filter(b =>
            b.name.toLowerCase().includes(searchBoard.toLowerCase())
         ),
      [boards, searchBoard]
   );

   // Переключатель приоритета: добавить или удалить из выбранных
   const togglePriority = useCallback((label: string) => {
      setSelectedPriorities(prev =>
         prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
      );
   }, []);

   // Переключатель статуса
   const toggleStatus = useCallback((label: string) => {
      setSelectedStatuses(prev =>
         prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
      );
   }, []);

   // Переключатель доски
   const toggleBoard = useCallback((name: string) => {
      setSelectedBoards(prev =>
         prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
      );
   }, []);

   /**
    * Применить текущие фильтры.
    *
    * Конвертирует выбранные метки обратно в их программные значения
    * и вызывает onApply + закрывает диалог через close().
    */
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

   /** Сбросить все выбранные фильтры */
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
