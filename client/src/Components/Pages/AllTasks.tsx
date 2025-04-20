// src/Pages/AllTasks.tsx

import React, { useState, useMemo } from 'react';
import { Box, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../ReduxStore/store';
import { selectTasks } from '../../ReduxSlices/dataSlice';
import { Task } from '../../Interfaces/appInterfaces';
import { Filter } from '../../Interfaces/serviceInterfaces';
import TaskDialog from '../Dialogs/TaskDialog';
import FilterDialog from '../Dialogs/FilterDialog';
import { useLocalStorage } from '../../Hooks/useLocalStorage';
import { SearchAndFilterBar } from '../Beauty/Filter/SearchAndFilterBar';
import { TaskList } from '../Beauty/Task/TaskList';
import { NewTaskButton } from '../Beauty/Task/NewTaskButton';
import {
   prioritiesStatusesToRu,
} from '../Constants/taskMapping';

/**
 * Страница "Все задачи".
 *
 * Отображает список всех задач с возможностью поиска, фильтрации,
 * создания и редактирования. Использует локальное хранилище для
 * сохранения состояния поиска и фильтров.
 */
export default function AllTasks() {
   // Получаем все задачи из Redux
   const allTasks = useSelector((s: RootState) => selectTasks(s));
   // Список досок для навигации
   const boards = useSelector((s: RootState) => s.data.boards ?? []);
   const navigate = useNavigate();

   // Состояние поискового текста (сохраняется в localStorage)
   const [searchText, setSearchText] = useLocalStorage<string>(
      'allTasksSearch',
      ''
   );
   // Состояние фильтров (приоритеты, статусы, доски)
   const [filters, setFilters] = useLocalStorage<Filter>(
      'allTasksFilters',
      { priorities: [], statuses: [], boards: [] }
   );

   // Управление модальными окнами
   const [openFilter, setOpenFilter] = useState(false);
   const [openTask, setOpenTask] = useState(false);
   const [selectedTask, setSelectedTask] = useState<Partial<Task>>({});

   /**
    * Вычисляем отображаемый список задач с учётом поиска и фильтров.
    */
   const displayed = useMemo(() => {
      return allTasks
         .filter(t =>
            t.title.toLowerCase().includes(searchText.toLowerCase())
         )
         .filter(t =>
            filters.priorities.length
               ? filters.priorities.includes(t.priority)
               : true
         )
         .filter(t =>
            filters.statuses.length
               ? filters.statuses.includes(t.status ?? '')
               : true
         )
         .filter(t =>
            filters.boards.length
               ? filters.boards.includes(t.boardName)
               : true
         );
   }, [allTasks, searchText, filters]);

   /**
    * Открывает диалог создания/редактирования задачи.
    * Если передан объект задачи с id, то режим — редактирование.
    */
   const openTaskDialog = (task?: Task | Partial<Task>) => {
      if (task && 'id' in task && task.id) {
         // Переводим данные задачи в формат диалога
         const t = task as Task;
         setSelectedTask({
            id: t.id,
            title: t.title,
            description: t.description,
            priority: prioritiesStatusesToRu.priority[t.priority] ?? t.priority,
            status: prioritiesStatusesToRu.status[t.status] ?? t.status,
            assignee: { id: t.assignee?.id ?? t.assigneeId },
            boardName: t.boardName,
            boardId: t.boardId,
         });
      } else {
         // Пустой шаблон для создания новой задачи
         setSelectedTask({});
      }
      setOpenTask(true);
   };

   /**
    * Переходит на страницу доски при клике на кнопку в списке задач.
    */
   const navigateToBoard = (e: React.MouseEvent, task: Task) => {
      e.stopPropagation();
      const board = boards.find(b => b.name === task.boardName);
      if (board) {
         navigate(`/board/${board.id}`, {
            state: { taskId: task.id },
         });
      }
   };

   return (
      <Box sx={{ p: 2 }}>
         {/* Панель поиска и открытия фильтров */}
         <SearchAndFilterBar
            search={searchText}
            onSearch={setSearchText}
            onOpenFilter={() => setOpenFilter(true)}
         />

         <Paper sx={{ p: 2, border: t => `1px solid ${t.palette.divider}` }}>
            {/* Список задач */}
            <TaskList
               tasks={displayed}
               onOpen={openTaskDialog}
               onNav={navigateToBoard}
            />
            {/* Кнопка создания новой задачи */}
            <NewTaskButton onClick={() => openTaskDialog()} />
         </Paper>

         {/* Диалог создания/редактирования задачи */}
         <TaskDialog
            open={openTask}
            onClose={() => setOpenTask(false)}
            mode={selectedTask.id ? 'edit' : 'create'}
            initialValues={selectedTask}
            onSubmit={() => setOpenTask(false)}
         />

         {/* Диалог фильтрации */}
         <FilterDialog
            open={openFilter}
            initialValues={filters}
            onClose={() => setOpenFilter(false)}
            onApplyFilter={setFilters}
         />
      </Box>
   );
}
