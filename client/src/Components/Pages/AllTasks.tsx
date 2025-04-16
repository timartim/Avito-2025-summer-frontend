// AllTasks.tsx
import React, { useState, useEffect } from 'react';
import {
   Box,
   List,
   ListItem,
   ListItemText,
   TextField,
   Button,
   Paper,
   CircularProgress,
   Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import TaskDialog, { Task } from '../Dialogs/TaskDialog';
import FilterDialog, { Filter } from '../Dialogs/FilterDialog';
import { getTasks, TaskFull } from '../Api/taskRequests';
import '../../Styles/ButtonStyles.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const priorityServerToRu: Record<string, string> = {
   High: 'Высокое',
   Medium: 'Среднее',
   Low: 'Небольшое',
};

export const priorityRuToServer: Record<string, string> = {
   'Высокое': 'High',
   'Среднее': 'Medium',
   'Небольшое': 'Low',
};

const statusServerToRu: Record<string, string> = {
   Backlog: 'Не начато',
   InProgress: 'В процессе',
   Done: 'Выполнено',
};

export const statusRuToServer: Record<string, string> = {
   'Не начато': 'Backlog',
   'В процессе': 'InProgress',
   'Выполнено': 'Done',
};

export default function AllTasks() {
   const [tasks, setTasks] = useState<TaskFull[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [openTaskDialog, setOpenTaskDialog] = useState(false);
   const [selectedTask, setSelectedTask] = useState<Partial<Task>>({});
   const [searchText, setSearchText] = useState('');
   const [openFilterDialog, setOpenFilterDialog] = useState(false);
   const [allTasks, setAllTasks] = useState([]);
   const boards = useSelector((state => state.data.boards ?? []))
   const navigate = useNavigate();
   useEffect(() => {
      getTasks()
         .then((data) => {
            setTasks(data);
            setAllTasks(data);
            setError('');
         })
         .catch(() => {
            setError('Ошибка загрузки задач');
         })
         .finally(() => {
            setLoading(false);
         });
   }, []);

   const searchedTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchText.toLowerCase())
   );

   const handleTaskClick = (task: TaskFull, mode: string) => {

      const prRu = priorityServerToRu[task.priority] ?? task.priority;
      const stRu = statusServerToRu[task.status] ?? task.status;
      setSelectedTask({
         id: task.id,
         title: task.title,
         description: task.description,
         priority: prRu,
         status: stRu,
         assignee: { id: task.assignee.id },
         boardName: task.boardName,
      });
      if (mode === 'modal'){
         setOpenTaskDialog(true);
      }else if(mode === 'navigate'){
         const board = boards.find((element) => element.name === task.boardName);
         navigate(`/board/${board.id}`, { state: { task } });
      }
   };

   const handleAddTask = () => {
      setSelectedTask({
         title: '',
         description: '',
         priority: 'Среднее',
         status: '',
         assign: { id: 0 },
         boardName: '',
      });
      setOpenTaskDialog(true);
   };

   const handleOpenFilterDialog = () => setOpenFilterDialog(true);
   const handleCloseFilterDialog = () => setOpenFilterDialog(false);
   const handleApplyFilter = (filters: Filter) => {
      setTasks(allTasks.filter(element =>
         (filters.priorities.length > 0 ?  filters.priorities.includes(element.priority) : true) &&
         (filters.statuses.length > 0 ?  filters.statuses.includes(element.status) : true) &&
         (filters.boards.length > 0 ?  filters.boards.includes(element.boardName) : true)
      ));

      setOpenFilterDialog(false);
   }

   const handleTaskSubmit = (task: Task) => {
      const pr = priorityRuToServer[task.priority] ?? task.priority;
      const st =
         task.id && task.status
            ? statusRuToServer[task.status] ?? task.status
            : task.status ?? '';

      if (!task.id) {
         const newId = Date.now();
         setTasks((prev) => [
            ...prev,
            {
               id: newId,
               title: task.title,
               description: task.description,
               priority: pr || 'Medium',
               status: st || 'Backlog',
               assigneeId: task.assignee?.id ?? 0,
               boardId: 0,
               assignee: {
                  id: task.assignee?.id ?? 0,
                  fullName: '',
                  email: '',
                  avatarUrl: '',
               },
               boardName: task.boardName || '',
            },
         ]);
      } else {
         setTasks((prev) =>
            prev.map((t) => {
               if (t.id !== task.id) return t;
               return {
                  ...t,
                  title: task.title,
                  description: task.description,
                  priority: pr,
                  status: st,
                  assigneeId: task.assignee?.id ?? 0,
                  boardName: task.boardName || '',
               };
            })
         );
      }
      setOpenTaskDialog(false);
   };
   function findTasks(e){
      setSearchText(e.target.value)
   }
   if (loading) {
      return (
         <Box sx={{ p: 2, textAlign: 'center' }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return (
         <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
         </Box>
      );
   }
   return (
      <Box sx={{ p: 2, width: '100%', height: '100%', position: 'relative' }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
               label="Поиск"
               variant="outlined"
               value={searchText}
               onChange={findTasks}
               sx={{ flexGrow: 1, mr: 2, maxWidth: '500px' }}
            />
            <Button
               variant="contained"
               color="primary"
               startIcon={<FilterListIcon />}
               className="simple-button"
               onClick={handleOpenFilterDialog}
            >
               Фильтры
            </Button>
         </Box>
         <Paper sx={(theme) => ({ p: 2, border: `1px solid ${theme.palette.divider}` })}>
            <List sx={{ overflowY: 'auto', maxHeight: '60vh' }}>
               {searchedTasks.map((task) => {
                  console.log(boards)
                  const board = boards.find((element) => element.name === task.boardName);

                  return (<ListItem
                     key={task.id}
                     button
                     onClick={() => handleTaskClick(task, 'modal')}
                     sx={(theme) => ({
                        py: 1,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        '&:last-child': { borderBottom: 'none' },
                     })}
                  >
                     <ListItemText primary={task.title} />
                     {board ? (
                        <Button
                           variant="contained"
                           className="nav-button"
                           onClick={() => handleTaskClick(task, 'navigate')}
                           sx={{ textTransform: 'none' }}
                        >
                           Перейти на доску
                        </Button>
                     ) : (
                        <Button
                           variant="outlined"
                           disabled
                           sx={{ textTransform: 'none' }}
                        >
                           Доска не найдена
                        </Button>
                     )}
                  </ListItem>)
            })}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
               <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTask}
                  className="simple-button"
               >
                  Добавить задачу
               </Button>
            </Box>
         </Paper>
         <TaskDialog
            open={openTaskDialog}
            onClose={() => setOpenTaskDialog(false)}
            mode={selectedTask.id ? 'edit' : 'create'}
            initialValues={selectedTask}
            onSubmit={handleTaskSubmit}
         />
         <FilterDialog
            open={openFilterDialog}
            onClose={handleCloseFilterDialog}
            onApplyFilter={handleApplyFilter}
         />
      </Box>
   );
}
