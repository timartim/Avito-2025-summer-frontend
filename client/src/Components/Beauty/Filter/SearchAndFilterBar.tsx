// src/components/Task/SearchAndFilterBar.tsx

import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Props {
   /**
    * Текущая строка поиска.
    */
   search: string;
   /**
    * Колбэк при изменении текста поиска.
    * @param value Новое значение строки поиска.
    */
   onSearch: (value: string) => void;
   /**
    * Колбэк для открытия панели фильтров.
    */
   onOpenFilter: () => void;
}

/**
 * Компонент строки поиска с кнопкой открытия фильтров.
 *
 * Отображает текстовое поле для ввода поискового запроса
 * и кнопку с иконкой для открытия диалогового окна фильтров.
 */
export function SearchAndFilterBar({ search, onSearch, onOpenFilter }: Props) {
   return (
      <Box sx={{ display: 'flex', mb: 2 }}>
         {/* Поле ввода для поиска по задачам */}
         <TextField
            label="Поиск"
            value={search}
            onChange={e => onSearch(e.target.value)}
            sx={{ flexGrow: 1, mr: 2, maxWidth: 500 }}
         />

         {/* Кнопка открытия панели фильтров */}
         <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={onOpenFilter}
            className="simple-button"
         >
            Фильтры
         </Button>
      </Box>
   );
}
