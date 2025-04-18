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
import { updateTaskStatus } from '../ReduxSlices/dataSlice.ts';
import { Task } from '../../Interfaces/appInterfaces.ts';

interface RouteParams {
   id: string;
}


export default function BoardTasks() {
   const { id } = useParams<RouteParams>();
   const boardId = Number(id);
   const location = useLocation<{ task?: any }>();
   const navigate = useNavigate();
   const dispatch = useDispatch<AppDispatch>();

   const groupedTasks = useSelector(selectBoardTasks);
   const currentBoardId = useSelector(selectCurrentBoard);
   const loading = useSelector(selectBoardLoading);
   const error = useSelector(selectBoardError);
   const boards = useSelector((s: RootState) => s.data.boards);

   const boardName = boards.find((b) => b.id === boardId)?.name || 'Доска не найдена';
   const [selectedTask, setSelectedTask] = useState<any>(null);
   const [openDialog, setOpenDialog] = useState(false);

   useEffect(() => {
      if (!isNaN(boardId) && currentBoardId !== boardId) {
         dispatch(fetchBoardTasks(boardId));
      }
   }, [dispatch, boardId, currentBoardId]);



   useEffect(() => {
      if (location.state?.task) {
         setSelectedTask(location.state.task);
         setOpenDialog(true);
         navigate(location.pathname, { replace: true, state: {} });
      }
   }, []);

   const handleDragEnd = (result: DropResult) => {
      const { source, destination } = result;
      if (
         !destination ||
         (destination.droppableId === source.droppableId && destination.index === source.index)
      ) {
         return;
      }

      const newGrouped = { ...groupedTasks };
      const sourceList = Array.from(newGrouped[source.droppableId]);
      const [moved] = sourceList.splice(source.index, 1);
      newGrouped[source.droppableId] = sourceList;

      const destList = Array.from(newGrouped[destination.droppableId]);
      destList.splice(destination.index, 0, moved);
      newGrouped[destination.droppableId] = destList;


      dispatch(updateTaskStatus({
         id: moved.id!,
         status: destination.droppableId as 'Backlog' | 'InProgress' | 'Done'
      }));
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
         <Typography sx={{ fontSize: '25px', fontWeight: 'bold', m: 1 }}>
            {boardName}
         </Typography>

         <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', gap: 2 }}>
               {(['Backlog', 'InProgress', 'Done'] as const).map((status) => (
                  <Droppable droppableId={status} key={status}>
                     {(provided, snapshot) => (
                        <Box
                           sx={{
                              flex: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              height: '100%',
                           }}
                        >
                           {/* Заголовок вне скролла */}
                              <Typography sx={{ p: 1, mb: 1, fontSize: '20px', fontWeight: 'bold' }}>
                                 {status === 'Backlog'
                                    ? 'Не начато'
                                    : status === 'InProgress'
                                       ? 'В процессе'
                                       : 'Завершено'}
                              </Typography>

                              {/* Скроллыбельная область тасок */}
                              <Box
                                 ref={provided.innerRef}
                                 {...provided.droppableProps}
                                 sx={{
                                    flexGrow: 1,
                                    maxHeight: '70vh',
                                    minHeight: '80px',
                                    overflowY: 'auto',
                                    p: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                 }}
                              >
                                 {groupedTasks[status].map((task, idx) => (
                                    <Draggable key={task.id} draggableId={String(task.id)} index={idx}>
                                       {(prov, snap) => (
                                          <Box
                                             ref={prov.innerRef}
                                             {...prov.draggableProps}
                                             {...prov.dragHandleProps}
                                             onClick={() => handleTaskClick(task)}
                                             sx={{
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
                        </Box>
                     )}
                  </Droppable>
               ))}
            </Box>
         </DragDropContext>

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
