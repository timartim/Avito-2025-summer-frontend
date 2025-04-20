// src/Components/Beauty/Draft/DraftItem.tsx

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

/**
 * Свойства компонента DraftItem.
 *
 * @param draft      Объект с данными черновика задачи (частичные поля Task).
 * @param index      Индекс черновика в списке.
 * @param onRestore  Функция-обработчик восстановления черновика.
 * @param onDelete   Функция-обработчик удаления черновика.
 */
interface DraftItemProps {
   draft: Partial<Task>;
   index: number;
   onRestore: (draft: Partial<Task>, idx: number) => void;
   onDelete: (idx: number) => void;
}

/**
 * Компонент элемента списка черновиков.
 *
 * Отображает заголовок и часть описания задачи из черновика,
 * а также иконки для восстановления и удаления черновика.
 *
 * Использует MUI ListItem и IconButton.
 */
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
               {/* Восстановить черновик */}
               <IconButton edge="end" className='simple-button' onClick={() => onRestore(draft, index)}>
                  <RestoreIcon />
               </IconButton>
               {/* Удалить черновик */}
               <IconButton edge="end"  className='simple-button' onClick={() => onDelete(index)} sx={{ ml: 1 }}>
                  <DeleteIcon />
               </IconButton>
            </Box>
         }
         sx={{ py: 1 }}
      >
         <ListItemText
            primary={draft.title || `без названия ${index + 1}`}
            secondary={draft.description ? `${draft.description.substring(0, 100)}…` : ''}
            sx={{ pr: 10 /* резервируем место для кнопок */ }}
         />
      </ListItem>
   );
});
