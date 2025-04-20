// src/components/Task/NewTaskButton.tsx

import React from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Props {
   /** Обработчик клика по кнопке создания новой задачи */
   onClick: () => void;
}

/**
 * Кнопка для создания новой задачи.
 *
 * Отображается как плавающая кнопка с иконкой "добавить" в правом нижнем углу
 * контейнера. При клике вызывает переданный onClick.
 */
export function NewTaskButton({ onClick }: Props) {
   return (
      // Обёртка для позиционирования кнопки
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
         <IconButton
            onClick={onClick}
            color="primary"
            className="simple-button"
            size="medium"
            sx={{
               border: 1,
               borderColor: 'primary.main',
               width: 40,
               height: 40,
               p: 0,
            }}
         >
            {/* Иконка добавления */}
            <AddIcon />
         </IconButton>
      </Box>
   );
}
