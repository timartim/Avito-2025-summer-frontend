// src/Components/Beauty/Filter/BoardFilter.tsx

import React from 'react';
import {
   Paper,
   FormControl,
   FormLabel,
   TextField,
   Box,
   FormGroup,
   FormControlLabel,
   Checkbox,
   Typography,
} from '@mui/material';
import { Board } from '../../../Interfaces/appInterfaces';

/**
 * Свойства компонента BoardFilter.
 *
 * @param filteredBoards  Отфильтрованный список досок для отображения.
 * @param search          Текущий текст поиска по названиям досок.
 * @param onSearch        Колбэк при изменении текста поиска.
 * @param selected        Список имён досок, выбранных пользователем.
 * @param onToggle        Колбэк при переключении состояния чекбокса доски.
 */
interface BoardFilterProps {
   filteredBoards: Board[];
   search: string;
   onSearch: (v: string) => void;
   selected: string[];
   onToggle: (label: string) => void;
}

/**
 * Компонент фильтра по доскам.
 *
 * Отображает:
 * - Поле для поиска досок по имени.
 * - Список чекбоксов с доступными досками.
 *
 * Позволяет выбрать несколько досок для фильтрации задач.
 */
export function BoardFilter({
                               filteredBoards,
                               search,
                               onSearch,
                               selected,
                               onToggle,
                            }: BoardFilterProps) {
   return (
      <Paper variant="outlined" sx={{ p: 2 }}>
         <FormControl component="fieldset" fullWidth>
            {/* Заголовок группы фильтра */}
            <FormLabel component="legend" sx={{ mb: 1, color: 'primary.dark' }}>
               Доски
            </FormLabel>

            {/* Поле ввода для поиска доски */}
            <TextField
               label="Поиск доски"
               size="small"
               value={search}
               onChange={e => onSearch(e.target.value)}
               sx={{ mb: 2 }}
            />

            {/* Список чекбоксов для выбора досок */}
            <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
               <FormGroup>
                  {filteredBoards.map(b => (
                     <FormControlLabel
                        key={b.id}
                        control={
                           <Checkbox
                              checked={selected.includes(b.name)}
                              onChange={() => onToggle(b.name)}
                           />
                        }
                        label={
                           <Typography sx={{ color: 'text.primary' }}>
                              {b.name}
                           </Typography>
                        }
                     />
                  ))}
               </FormGroup>
            </Box>
         </FormControl>
      </Paper>
   );
}
