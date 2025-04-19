// src/components/Board/StatusColumn.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Task } from '../../Interfaces/appInterfaces';
import { TaskStatusKey } from '../../constants/taskStatus';

interface Props {
   statusKey: TaskStatusKey;
   statusLabel: string;
   tasks: Task[];
   onClick: (task: Task) => void;
}

export function StatusColumn({ statusKey, statusLabel, tasks, onClick }: Props) {
   return (
      <Droppable droppableId={statusKey}>
         {(provided) => (
            <Box
               ref={provided.innerRef}
               {...provided.droppableProps}
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
               <Typography sx={{ p: 1, mb: 1, fontSize: 20, fontWeight: 'bold' }}>
                  {statusLabel}
               </Typography>
               <Box
                  sx={{
                     flexGrow: 1,
                     maxHeight: { xs: 'auto', sm: '70vh' },
                     minHeight: '80px',
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
                  {provided.placeholder}
               </Box>
            </Box>
         )}
      </Droppable>
   );
}
