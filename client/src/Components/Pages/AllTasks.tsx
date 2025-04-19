// src/pages/AllTasks.tsx
import React, { useState, useMemo } from 'react';
import { Box, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../ReduxStore/store';
import { selectTasks } from '../ReduxSlices/dataSlice';
import { Task } from '../Interfaces/appInterfaces';
import { Filter } from '../Interfaces/serviceInterfaces';
import TaskDialog from '../Dialogs/TaskDialog';
import FilterDialog from '../Dialogs/FilterDialog';
import { useLocalStorage } from '../Hooks/useLocalStorage';
import { SearchAndFilterBar } from '../Beauty/SearchAndFilterBar';
import { TaskList } from '../Beauty/TaskList';
import { NewTaskButton } from '../Beauty/NewTaskButton';
import {
   priorityServerToRu,
   statusServerToRu,
} from '../Constants/taskMapping.ts';

export default function AllTasks() {
   const allTasks = useSelector((s: RootState) => selectTasks(s));
   const boards = useSelector((s: RootState) => s.data.boards ?? []);
   const navigate = useNavigate();

   const [searchText, setSearchText] = useLocalStorage<string>('allTasksSearch', '');
   const [filters, setFilters] = useLocalStorage<Filter>(
      'allTasksFilters',
      { priorities: [], statuses: [], boards: [] }
   );

   const [openFilter, setOpenFilter] = useState(false);
   const [openTask, setOpenTask] = useState(false);
   const [selectedTask, setSelectedTask] = useState<Partial<Task>>({});

   const displayed = useMemo(() => {
      return allTasks
         .filter(t => t.title.toLowerCase().includes(searchText.toLowerCase()))
         .filter(t => (filters.priorities.length ? filters.priorities.includes(t.priority) : true))
         .filter(t => (filters.statuses.length ? filters.statuses.includes(t.status ?? '') : true))
         .filter(t => (filters.boards.length ? filters.boards.includes(t.boardName) : true));
   }, [allTasks, searchText, filters]);

   const openTaskDialog = (task?: Task | Partial<Task>) => {
      if (task && 'id' in task && task.id) {
         const t = task as Task;
         setSelectedTask({
            id: t.id,
            title: t.title,
            description: t.description,
            priority: priorityServerToRu[t.priority] ?? t.priority,
            status: statusServerToRu[t.status] ?? t.status,
            assignee: { id: t.assignee?.id ?? t.assigneeId },
            boardName: t.boardName,
            boardId: t.boardId,
         });
      } else {
         setSelectedTask({});
      }
      setOpenTask(true);
   };

   const navigateToBoard = (e: React.MouseEvent, task: Task) => {
      e.stopPropagation();
      const board = boards.find(b => b.name === task.boardName);
      if (board) navigate(`/board/${board.id}`, { state: { task } });
   };

   return (
      <Box sx={{ p: 2 }}>
         <SearchAndFilterBar
            search={searchText}
            onSearch={setSearchText}
            onOpenFilter={() => setOpenFilter(true)}
         />
         <Paper sx={{ p: 2, border: t => `1px solid ${t.palette.divider}` }}>
            <TaskList tasks={displayed} onOpen={openTaskDialog} onNav={navigateToBoard} />
            <NewTaskButton onClick={() => openTaskDialog()} />
         </Paper>
         <TaskDialog
            open={openTask}
            onClose={() => setOpenTask(false)}
            mode={selectedTask.id ? 'edit' : 'create'}
            initialValues={selectedTask}
            onSubmit={() => setOpenTask(false)}
         />
         <FilterDialog
            open={openFilter}
            initialValues={filters}
            onClose={() => setOpenFilter(false)}
            onApplyFilter={setFilters}
         />
      </Box>
   );
}
