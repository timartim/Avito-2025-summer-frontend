// src/Pages/BoardTasks.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import TaskDialog from '../Dialogs/TaskDialog';
import { RootState, AppDispatch } from '../ReduxStore/store';
import { updateTaskStatus } from '../ReduxSlices/dataSlice';
import { useBoardTasks } from '../Hooks/useBoardTasks';
import { StatusColumn } from '../Beauty/StatusColumn';
import { TASK_STATUSES } from '../Constants/taskStatus';
import { Task } from '../Interfaces/appInterfaces';

interface RouteParams { id: string }

export default function BoardTasks() {
   const { id } = useParams<RouteParams>();
   const boardId = Number(id);
   const location = useLocation<{ task?: Task }>();
   const navigate = useNavigate();
   const dispatch = useDispatch<AppDispatch>();

   const boards = useSelector((s: RootState) => s.data.boards);
   const boardName = boards.find(b => b.id === boardId)?.name ?? 'Доска не найдена';

   const { grouped, loading, error } = useBoardTasks(boardId);

   const [selected, setSelected] = useState<Task | null>(null);
   const [dialogOpen, setDialogOpen] = useState(false);

   useEffect(() => {
      if (location.state?.task) {
         setSelected(location.state.task);
         setDialogOpen(true);
         navigate(location.pathname, { replace: true, state: {} });
      }
   }, [location, navigate]);

   const onDragEnd = useCallback((result: DropResult) => {
      const { source, destination } = result;
      if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
         return;
      }
      const moved = grouped[source.droppableId as keyof typeof grouped][source.index];
      dispatch(updateTaskStatus({
         id: moved.id!,
         status: destination.droppableId as 'Backlog' | 'InProgress' | 'Done',
      }));
   }, [dispatch, grouped]);

   const handleClick = (task: Task) => {
      setSelected(task);
      setDialogOpen(true);
   };

   return (
      <Box sx={{ p: 2 }}>
         <Typography sx={{ fontSize: 25, fontWeight: 'bold', m: 1 }}>{boardName}</Typography>
         <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
               {TASK_STATUSES.map(({ key, label }) => (
                  <StatusColumn
                     key={key}
                     statusKey={key}
                     statusLabel={label}
                     tasks={grouped[key]}
                     onClick={handleClick}
                  />
               ))}
            </Box>
         </DragDropContext>
         <TaskDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            mode={selected?.id ? 'edit' : 'create'}
            initialValues={selected ?? {}}
            onSubmit={() => setDialogOpen(false)}
         />
      </Box>
   );
}
