// src/Pages/BoardTasks.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import TaskDialog from '../Dialogs/TaskDialog';
import { RootState, AppDispatch } from '../../ReduxStore/store';
import { updateTaskStatus } from '../../ReduxSlices/dataSlice';
import { useBoardTasks } from '../../Hooks/useBoardTasks';
import { StatusColumn } from '../Beauty/Task/StatusColumn';
import { TASK_STATUSES } from '../Constants/taskStatus';
import { Task } from '../../Interfaces/appInterfaces';

interface RouteParams {
   id: string;
}

/**
 * Страница задач конкретной доски.
 *
 * - Загружает из URL параметр id доски и находит её название в Redux.
 * - Использует хук useBoardTasks для получения сгруппированных задач.
 * - Обрабатывает драг-н-дроп через react-beautiful-dnd для изменения статуса задачи.
 * - Открывает диалог редактирования при клике на задачу или при передаче `taskId` в location.state.
 */
export default function BoardTasks() {
   // Получаем параметр id из URL и конвертируем в число
   const { id } = useParams<RouteParams>();
   const boardId = Number(id);

   // Для возможного открытия диалога по state при навигации
   const location = useLocation<{ taskId?: number }>();
   const navigate = useNavigate();

   const dispatch = useDispatch<AppDispatch>();

   // Список всех досок из Redux
   const boards = useSelector((s: RootState) => s.data.boards);
   // Находим название текущей доски
   const boardName = boards.find(b => b.id === boardId)?.name ?? 'Доска не найдена';

   // Хук получает сгруппированные задачи по статусам
   const { grouped } = useBoardTasks(boardId);

   // Состояние для открытия/закрытия диалога редактирования
   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
   const [dialogOpen, setDialogOpen] = useState(false);

   // При монтировании и изменении location.state.taskId проверяем,
   // нужно ли показывать диалог по параметру.
   useEffect(() => {
      const taskId = location.state?.taskId;
      if (typeof taskId === 'number') {
         let found: Task | undefined;
         // Ищем задачу в любой из трёх групп
         for (const { key } of TASK_STATUSES) {
            const list = grouped[key];
            found = list.find(t => t.id === taskId);
            if (found) break;
         }
         if (found) {
            const taskWithBoard: Task = { ...found, boardName };
            setSelectedTask(taskWithBoard);
            setDialogOpen(true);
            // Очищаем state, чтобы диалог не открывался при каждом рендере
            navigate(location.pathname, { replace: true, state: {} });
         }
      }
   }, [location.state?.taskId, grouped, navigate, location.pathname]);

   /**
    * Обработчик окончания перетаскивания.
    * При смене колонки отправляет экшен updateTaskStatus.
    */
   const onDragEnd = useCallback(
      (result: DropResult) => {
         const { source, destination } = result;
         // Если нет куда бросить или позиция не изменилась — ничего не делать
         if (
            !destination ||
            (destination.droppableId === source.droppableId &&
               destination.index === source.index)
         ) {
            return;
         }
         // Определяем перемещаемую задачу
         const moved = grouped[source.droppableId as keyof typeof grouped][source.index];
         dispatch(
            updateTaskStatus({
               id: moved.id!,
               status: destination.droppableId as 'Backlog' | 'InProgress' | 'Done',
            })
         );
      },
      [dispatch, grouped]
   );

   /**
    * Обработчик клика на задачу — открывает диалог редактирования.
    */
   const handleClick = (task: Task) => {
      const taskWithBoard: Task = { ...task, boardName };
      setSelectedTask(taskWithBoard);
      setDialogOpen(true);
   };

   return (
      <Box sx={{ p: 2 }}>
         {/* Заголовок с названием доски */}
         <Typography sx={{ fontSize: 25, fontWeight: 'bold', mb: 1 }}>
            {boardName}
         </Typography>

         {/* Контекст перетаскивания задач */}
         <DragDropContext onDragEnd={onDragEnd}>
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
               }}
            >
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

         {/* Диалог создания/редактирования задачи */}
         <TaskDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            mode={selectedTask?.id ? 'edit' : 'create'}
            initialValues={selectedTask ?? {}}
            onSubmit={() => setDialogOpen(false)}
         />
      </Box>
   );
}
