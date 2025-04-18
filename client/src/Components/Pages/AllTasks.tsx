// AllTasks.tsx
import React, { useState, useMemo, memo, useEffect } from 'react';
import {
   Box,
   List,
   ListItem,
   ListItemText,
   TextField,
   Button,
   Paper, IconButton,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../ReduxStore/store';
import {
   selectTasks,
   createTask,
   updateTask,
} from '../ReduxSlices/dataSlice';
import AddIcon from '@mui/icons-material/Add';
import { Task } from '../../Interfaces/appInterfaces.ts';
import FilterDialog from '../Dialogs/FilterDialog.tsx';
import TaskDialog from '../Dialogs/TaskDialog.tsx';
import { Filter } from '../../Interfaces/serviceInterfaces.ts';
export const priorityServerToRu: Record<string, string> = {
   High: 'Высокое',
   Medium: 'Среднее',
   Low: 'Небольшое',
};
export const priorityRuToServer: Record<string, string> = {
   'Высокое': 'High',
   'Среднее': 'Medium',
   'Небольшое': 'Low',
};
export const statusServerToRu: Record<string, string> = {
   Backlog: 'Не начато',
   InProgress: 'В процессе',
   Done: 'Выполнено',
};
export const statusRuToServer: Record<string, string> = {
   'Не начато': 'Backlog',
   'В процессе': 'InProgress',
   'Выполнено': 'Done',
};



const TaskList = memo(function TaskList({
                                           tasks,
                                           boards,
                                           onOpen,
                                           onNav,
                                        }: {
   tasks: Task[];
   boards: { id: number; name: string }[];
   onOpen: (t: Task) => void;
   onNav: (e: React.MouseEvent, t: Task) => void;
}) {
   return (
      <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
         {tasks.map((t) => (
            <ListItem
               key={t.id}
               button
               onClick={() => onOpen(t)}
               sx={(theme) => ({
                  py: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '&:last-child': { borderBottom: 'none' },
               })}
            >
               <ListItemText primary={t.title} />
               <Button
                  variant="contained"
                  onClick={(e) => onNav(e, t)}
                  className='simple-button'
               >
                  Перейти на доску
               </Button>
            </ListItem>
         ))}
      </List>
   );
});

export default function AllTasks() {
   const dispatch = useDispatch();
   const allTasks = useSelector((s: RootState) => selectTasks(s));
   const boards = useSelector((s: RootState) => s.data.boards ?? []);
   const navigate = useNavigate();

   /*
    * ────────────────────────────────────────────────────────────────────────
    *  Search & filters хранятся в localStorage, чтобы не теряться из‑за
    *  hot‑reload или строгого режима React.
    * ────────────────────────────────────────────────────────────────────────
    */
   const [searchText, setSearchText] = useState<string>(() => {
      try {
         const saved = localStorage.getItem('allTasksSearch');
         return saved ? JSON.parse(saved) : '';
      } catch {
         return '';
      }
   });

   const [filters, setFilters] = useState<Filter>(() => {
      try {
         const saved = localStorage.getItem('allTasksFilters');
         return saved ? JSON.parse(saved) : { priorities: [], statuses: [], boards: [] };
      } catch {
         return { priorities: [], statuses: [], boards: [] };
      }
   });

   /*
    *  Сохраняем изменения в localStorage.
    *  Для строки поиска используем JSON.stringify — так мы придерживаемся
    *  той же «глубокой копии», что и для объекта фильтров.
    */
   useEffect(() => {
      localStorage.setItem('allTasksFilters', JSON.stringify(filters));

   }, [filters]);

   useEffect(() => {
      localStorage.setItem('allTasksSearch', JSON.stringify(searchText));
   }, [searchText]);

   /* Диалоги */
   const [openFilter, setOpenFilter] = useState(false);
   const [openTask, setOpenTask] = useState(false);
   const [selTask, setSelTask] = useState<Partial<Task>>({});

   // список пересчитывается при смене allTasks, searchText или filters
   const displayed = useMemo(() => {
      return (allTasks as Task[])
         .filter((t) =>
            t.title.toLowerCase().includes(searchText.toLowerCase())
         )
         .filter((t) =>
            filters.priorities.length
               ? filters.priorities.includes(t.priority)
               : true
         )
         .filter((t) =>
            filters.statuses.length
               ? filters.statuses.includes(t.status ?? "")
               : true
         )
         .filter((t) =>
            filters.boards.length ? filters.boards.includes(t.boardName) : true
         );
   }, [allTasks, searchText, filters]);

   /* ------------------------------------------------------------------ */

   const openModal = (t: Task | Partial<Task>) => {
      if (t && (t as Task).id) {
         const full = t as Task;
         setSelTask({
            id: full.id,
            title: full.title,
            description: full.description,
            priority: priorityServerToRu[full.priority] ?? full.priority,
            status: statusServerToRu[full.status] ?? full.status,
            assignee: { id: full.assignee?.id ?? full.assigneeId },
            boardName: full.boardName,
            boardId: full.boardId,
         });
      } else {
         setSelTask({});
      }
      setOpenTask(true);
   };

   const navBoard = (e: React.MouseEvent, t: Task) => {
      e.stopPropagation();
      const b = boards.find((b) => b.name === t.boardName);
      if (b) navigate(`/board/${b.id}`, { state: { task: t } });
   };

   const handleSubmit = () => {
      setOpenTask(false);
   };

   return (
      <Box sx={{ p: 2 }}>
         {/* Поиск и кнопка фильтров */}
         <Box sx={{ display: 'flex', mb: 2 }}>
            <TextField
               label="Поиск"
               value={searchText}
               onChange={(e) => setSearchText(e.target.value)}
               sx={{ flexGrow: 1, mr: 2, maxWidth: 500 }}
            />
            <Button
               variant="contained"
               startIcon={<FilterListIcon />}
               onClick={() => setOpenFilter(true)}
               className='simple-button'
            >
               Фильтры
            </Button>
         </Box>

         {/* Список задач */}
         <Paper sx={{ p: 2, border: (t) => `1px solid ${t.palette.divider}` }}>
            <TaskList tasks={displayed} boards={boards} onOpen={openModal} onNav={navBoard} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
               <IconButton
                  onClick={() => openModal({})}
                  color="primary"
                  className="simple-button"
                  size="medium"
                  sx={{
                     border: 1,
                     borderColor: 'primary.main',
                     width: 40,
                     height: 40,
                     p: 0,
                  }}
               >
                  <AddIcon />
               </IconButton>
            </Box>
         </Paper>

         {/* Диалог задачи */}
         <TaskDialog
            open={openTask}
            onClose={() => setOpenTask(false)}
            mode={selTask.id ? 'edit' : 'create'}
            initialValues={selTask}
            onSubmit={handleSubmit}
         />

         {/* Диалог фильтров */}
         <FilterDialog
            open={openFilter}
            initialValues={filters}
            onClose={() => setOpenFilter(false)}
            onApplyFilter={(f) => {
               setFilters(JSON.parse(JSON.stringify(f)));
               setOpenFilter(false);
            }}
         />
      </Box>
   );
}
