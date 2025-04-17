import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
   Box,
   Typography,
   CircularProgress,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getBoardTasks, Task } from '../Api/boardRequests';
import TaskDialog from '../Dialogs/TaskDialog';
import { RootState } from '../ReduxStore/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskStatus } from '../Api/taskRequests';
import { setLoading } from '../ReduxSlices/userActionSlice.ts';

interface RouteParams {
   id: string;
}

const groupTasksByStatus = (tasks: Task[]) => ({
   Backlog: tasks.filter((task) => task.status === 'Backlog'),
   InProgress: tasks.filter((task) => task.status === 'InProgress'),
   Done: tasks.filter((task) => task.status === 'Done'),
});

export default function BoardTasks() {
   const { id } = useParams<RouteParams>();
   const location = useLocation();
   const [tasks, setTasks] = useState<Task[]>([]);
   const [groupedTasks, setGroupedTasks] = useState<{ [key: string]: Task[] }>({
      Backlog: [],
      InProgress: [],
      Done: [],
   });
   const [error, setError] = useState<string>('');
   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
   const [openTaskDialog, setOpenTaskDialog] = useState(false);
   const dispatch = useDispatch()
   const boards = useSelector((state: RootState) => state.data.boards);
   const boardName = boards.find((board) => board.id === Number(id))?.name || 'Доска не найдена';

   useEffect(() => {
      if (typeof id === 'string') {

         getBoardTasks(parseInt(id))
            .then((res) => {
               setTasks(res);
               setGroupedTasks(groupTasksByStatus(res));
               setError('');
            })
            .catch((e) => {
               console.error('Ошибка загрузки задач:', e);
               setError('Ошибка загрузки задач');
            })
            .finally(() => {

            });
      }
   }, [id]);

   useEffect(() => {
      const passedTask = location.state?.task;
      if (passedTask) {

         setSelectedTask(passedTask);
         setOpenTaskDialog(true);
      }
   }, [location.state]);

   const handleTaskClick = (task: Task) => {
      setSelectedTask(task);
      setOpenTaskDialog(true);
   };


   const onDragEnd = async (result: DropResult) => {
      const { destination, source } = result;
      if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
         return;
      }
      const prevGroupedTasks = { ...groupedTasks };
      const newGroupedTasks = { ...groupedTasks };
      const sourceTasks = Array.from(newGroupedTasks[source.droppableId]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      newGroupedTasks[source.droppableId] = sourceTasks;

      const destTasks = Array.from(newGroupedTasks[destination.droppableId]);
      destTasks.splice(destination.index, 0, movedTask);
      newGroupedTasks[destination.droppableId] = destTasks;
      setGroupedTasks(newGroupedTasks);

      try {
         await updateTaskStatus(movedTask.id!, { status: destination.droppableId });
      } catch (error) {
         console.error('Ошибка обновления статуса задачи:', error);
         setGroupedTasks(prevGroupedTasks);
      }
   };

   if (error) {
      return (
         <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
         </Box>
      );
   }

   return (
      <Box sx={{ p: 2 }}>
         <Typography variant="h4" sx={{ mb: 2 }}>
            {boardName}
         </Typography>

         <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ display: 'flex', gap: 2 }}>
               {(['Backlog', 'InProgress', 'Done'] as const).map((statusKey) => (
                  <Droppable droppableId={statusKey} key={statusKey}>
                     {(provided, snapshot) => (
                        <Box
                           ref={provided.innerRef}
                           {...provided.droppableProps}
                           sx={{
                              flex: 1,
                              maxHeight: '70vh',
                              overflowY: 'auto',
                              bgcolor: snapshot.isDraggingOver ? 'grey.100' : 'grey.50',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                              p: 1,
                           }}
                        >
                           <Typography variant="h6" sx={{ mb: 1 }}>
                              {statusKey === 'Backlog'
                                 ? 'Не начато'
                                 : statusKey === 'InProgress'
                                    ? 'В процессе'
                                    : 'Завершено'}
                           </Typography>
                           {groupedTasks[statusKey].map((task, index) => (
                              <Draggable
                                 draggableId={String(task.id)}
                                 index={index}
                                 key={task.id}
                              >
                                 {(provided, snapshot) => (
                                    <Box
                                       ref={provided.innerRef}
                                       {...provided.draggableProps}
                                       {...provided.dragHandleProps}
                                       onClick={() => handleTaskClick(task)}
                                       sx={{
                                          mb: 1,
                                          p: 1,
                                          border: '1px solid',
                                          borderColor: snapshot.isDragging ? 'primary.main' : 'divider',
                                          borderRadius: 1,
                                          bgcolor: 'background.paper',
                                          cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                                       }}
                                    >
                                       {task.title}
                                    </Box>
                                 )}
                              </Draggable>
                           ))}
                           {provided.placeholder}
                        </Box>
                     )}
                  </Droppable>
               ))}
            </Box>
         </DragDropContext>

         {selectedTask && (
            <TaskDialog
               open={openTaskDialog}
               onClose={() => setOpenTaskDialog(false)}
               mode="edit"
               initialValues={selectedTask}
               onSubmit={() => setOpenTaskDialog(false)}
            />
         )}
      </Box>
   );
}
