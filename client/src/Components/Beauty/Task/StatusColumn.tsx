// src/components/Board/StatusColumn.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Task } from '../../../Interfaces/appInterfaces';
import { TaskStatusKey } from '../../constants/taskStatus';

interface Props {
   /** Ключ статуса (Backlog / InProgress / Done) — **id** droppable‑зоны */
   statusKey: TaskStatusKey;
   /** Заголовок, который показываем пользователю («Не начато», …) */
   statusLabel: string;
   /** Список задач, принадлежащих колонке */
   tasks: Task[];
   /** Обработчик клика по карточке задачи */
   onClick: (task: Task) => void;
}

/**
 * **StatusColumn** — одиночная колонка на доске задач.
 *
 * ▸Имеет две части:
 *  1. Шапка‑заголовок с названием статуса (не участвует в DnD).
 *  2. Скроллируемый список карточек,обёрнутый в`Droppable`.
 *
 * ▸Карточки (`Task`) оборачиваются в `Draggable`, что позволяет
 * перетягивать их между колонками.
 *
 * ▸Когда список пуст, `minHeight` (80px) недаёт placeholder’у
 * «прилипнуть» к заголовку и упрощает Drag‑and‑Drop.
 */
export function StatusColumn({ statusKey, statusLabel, tasks, onClick }: Props) {
   return (
      /* Оболочка колонки (НЕ является droppable‑зоной) */
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
         {/* Заголовок статуса */}
         <Typography sx={{ p: 1, mb: 1, fontSize: 20, fontWeight: 'bold' }}>
            {statusLabel}
         </Typography>

         {/* Список задач – droppable‑контейнер */}
         <Droppable droppableId={statusKey}>
            {(provided) => (
               <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                     flexGrow: 1,
                     maxHeight: { xs: 'auto', sm: '70vh' },
                     minHeight: 80,
                     overflowY: 'auto',
                     p: 1,
                     display: 'flex',
                     flexDirection: 'column',
                     gap: 1,
                  }}
               >
                  {tasks.map((task, index) => (
                     <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                        {(prov, snap) => (
                           <Box
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              onClick={() => onClick(task)}
                              sx={{
                                 p: 1,
                                 border: '1px solid',
                                 borderColor: snap.isDragging ? 'primary.main' : 'divider',
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

                  {/* Placeholder: область, куда “садится” карточка во время перетягивания */}
                  {provided.placeholder}
               </Box>
            )}
         </Droppable>
      </Box>
   );
}
