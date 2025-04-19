// src/Components/Dialogs/DraftItem.tsx
import React, { memo } from 'react';
import {
   ListItem,
   ListItemText,
   IconButton,
   Box,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../../../Interfaces/appInterfaces';

interface DraftItemProps {
   draft: Partial<Task>;
   index: number;
   onRestore: (draft: Partial<Task>, idx: number) => void;
   onDelete: (idx: number) => void;
}

export const DraftItem = memo(function DraftItem({
                                                    draft,
                                                    index,
                                                    onRestore,
                                                    onDelete,
                                                 }: DraftItemProps) {
   return (
      <ListItem
         divider
         alignItems="flex-start"
         secondaryAction={
            <Box>
               <IconButton edge="end" onClick={() => onRestore(draft, index)}>
                  <RestoreIcon />
               </IconButton>
               <IconButton edge="end" onClick={() => onDelete(index)} sx={{ ml: 1 }}>
                  <DeleteIcon />
               </IconButton>
            </Box>
         }
         sx={{ py: 1 }}
      >
         <ListItemText
            primary={draft.title || `без названия ${index + 1}`}
            secondary={draft.description ? `${draft.description.substring(0, 100)}…` : ''}
            sx={{ pr: 10 /* reserve space for action buttons */ }}
         />
      </ListItem>
   );
});
