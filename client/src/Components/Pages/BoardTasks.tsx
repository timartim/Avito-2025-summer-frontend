// src/Pages/BoardTasks.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
   Box,
   Typography,
   CircularProgress,
} from '@mui/material';
import {
   DragDropContext,
   Droppable,
   Draggable,
   DropResult,
} from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import TaskDialog from '../Dialogs/TaskDialog';
import { RootState, AppDispatch } from '../ReduxStore/store';
import {
   fetchBoardTasks,
   selectBoardTasks,
   selectCurrentBoard,
   selectLoading as selectBoardLoading,
   selectError as selectBoardError,
} from '../ReduxSlices/dataSlice';
import { updateTaskStatus } from '../Api/taskRequests';

interface RouteParams {
   id: string;
}

const groupTasksByStatus = (tasks: Array<{ id?: number; status: string; title: string }>) => ({
   Backlog: tasks.filter((t) => t.status === 'Backlog'),
   InProgress: tasks.filter((t) => t.status === 'InProgress'),
   Done: tasks.filter((t) => t.status === 'Done'),
});

export default function BoardTasks() {
   const { id } = useParams<RouteParams>();
   const boardId = Number(id);
   const location = useLocation<{ task?: any }>();
   const navigate = useNavigate();
   const dispatch = useDispatch<AppDispatch>();

   // Redux state
   const boardTasks = useSelector(selectBoardTasks);
   const currentBoardId = useSelector(selectCurrentBoard);
   const loading = useSelector(selectBoardLoading);
   const error = useSelector(selectBoardError);
   const boards = useSelector((s: RootState) => s.data.boards);

   const boardName = boards.find((b) => b.id === boardId)?.name || 'Доска не найдена';

   // Local state
   const [groupedTasks, setGroupedTasks] = useState(groupTasksByStatus(boardTasks));
   const [selectedTask, setSelectedTask] = useState<any>(null);
   const [openDialog, setOpenDialog] = useState(false);

   // 1) Fetch tasks for this board if not already loaded
   useEffect(() => {
      if (!isNaN(boardId) && currentBoardId !== boardId) {
         dispatch(fetchBoardTasks(boardId));
      }
   }, [dispatch, boardId, currentBoardId]);

   // 2) Whenever tasks in Redux change, re-group them
   useEffect(() => {
      setGroupedTasks(groupTasksByStatus(boardTasks));
   }, [boardTasks]);

   // 3) On mount, open dialog if navigated here with a task, then clear location.state
   useEffect(() => {
      if (location.state?.task) {
         setSelectedTask(location.state.task);
         setOpenDialog(true);
         // remove the task from location.state so it won't re-open
         navigate(location.pathname, { replace: true, state: {} });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []); // run only once on mount

   // Handlers
   const handleDragEnd = async (result: DropResult) => {
      const { source, destination } = result;
      if (
         !destination ||
         (destination.droppableId === source.droppableId && destination.index === source.index)
      ) {
         return;
      }

      const prev = groupedTasks;
      const copy = { ...groupedTasks };
      const sourceList = Array.from(copy[source.droppableId]);
      const [moved] = sourceList.splice(source.index, 1);
      copy[source.droppableId] = sourceList;
      const destList = Array.from(copy[destination.droppableId]);
      destList.splice(destination.index, 0, moved);
      copy[destination.droppableId] = destList;
      setGroupedTasks(copy);

      try {
         await updateTaskStatus(moved.id!, { status: destination.droppableId });
      } catch {
         setGroupedTasks(prev);
      }
   };

   const handleTaskClick = (task: any) => {
      setSelectedTask(task);
      setOpenDialog(true);
   };

   if (loading && currentBoardId === boardId) {
      return (
         <Box sx={{ p: 2, textAlign: 'center' }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error && currentBoardId === boardId) {
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

         <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', gap: 2 }}>
               {(['Backlog', 'InProgress', 'Done'] as const).map((status) => (
                  <Droppable droppableId={status} key={status}>
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
                              {status === 'Backlog'
                                 ? 'Не начато'
                                 : status === 'InProgress'
                                    ? 'В процессе'
                                    : 'Завершено'}
                           </Typography>
                           {groupedTasks[status].map((task, idx) => (
                              <Draggable key={task.id} draggableId={String(task.id)} index={idx}>
                                 {(prov, snap) => (
                                    <Box
                                       ref={prov.innerRef}
                                       {...prov.draggableProps}
                                       {...prov.dragHandleProps}
                                       onClick={() => handleTaskClick(task)}
                                       sx={{
                                          mb: 1,
                                          p: 1,
                                          border: '1px solid',
                                          borderColor: snap.isDragging
                                             ? 'primary.main'
                                             : 'divider',
                                          borderRadius: 1,
                                          bgcolor: 'background.paper',
                                          cursor: snap.isDragging ? 'grabbing' : 'grab',
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

         {/* TaskDialog for edit/create */}
         <TaskDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            mode={selectedTask?.id ? 'edit' : 'create'}
            initialValues={selectedTask || {}}
            onSubmit={() => setOpenDialog(false)}
         />
      </Box>
   );
}
