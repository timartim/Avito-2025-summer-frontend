// src/components/Task/TaskList.tsx
import React, { memo } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { Task } from '../../../Interfaces/appInterfaces';

interface Props {
   tasks: Task[];
   onOpen: (task: Task) => void;
   onNav: (e: React.MouseEvent, task: Task) => void;
}

export const TaskList = memo(function TaskList({ tasks, onOpen, onNav }: Props) {
   return (
      <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
         {tasks.map(t => (
            <ListItem
               key={t.id}
               button
               onClick={() => onOpen(t)}
               sx={theme => ({
                  py: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '&:last-child': { borderBottom: 'none' },
               })}
            >
               <ListItemText primary={t.title} />
               <Button
                  variant="contained"
                  onClick={e => onNav(e, t)}
                  className="simple-button"
               >
                  Перейти на доску
               </Button>
            </ListItem>
         ))}
      </List>
   );
});
