// src/Components/Beauty/Task/TaskList.tsx

import React, { memo } from 'react';
import {
   List,
   ListItem,
   ListItemButton,
   ListItemText,
   Button,
} from '@mui/material';
import { Task } from '../../../Interfaces/appInterfaces';

interface Props {
   /** Список отображаемых задач */
   tasks: Task[];
   /** Открыть карточку задачи */
   onOpen: (task: Task) => void;
   /** Навигация на доску задачи */
   onNav: (e: React.MouseEvent, task: Task) => void;
}

/**
 * Компонент отображает список задач с возможностью:
 * - открыть задачу (onOpen)
 * - перейти на доску задачи (onNav)
 *
 * Использует MUI List для отображения и стилизации элементов.
 */
export const TaskList = memo(function TaskList({
                                                  tasks,
                                                  onOpen,
                                                  onNav,
                                               }: Props) {
   return (
      <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
         {tasks.map(t => (
            <ListItem
               key={t.id}
               disablePadding
               secondaryAction={
                  <Button
                     variant="contained"
                     onClick={e => onNav(e, t)}
                     className="simple-button"
                  >
                     Перейти на доску
                  </Button>
               }
               sx={theme => ({
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '&:last-child': { borderBottom: 'none' },
               })}
            >
               {/* Кликабельная область для открытия задачи */}
               <ListItemButton onClick={() => onOpen(t)} sx={{ py: 1 }}>
                  <ListItemText primary={t.title} />
               </ListItemButton>
            </ListItem>
         ))}
      </List>
   );
});
