// src/Components/Filter/FilterGroup.tsx

import React from 'react';
import {
   Paper,
   FormControl,
   FormLabel,
   FormGroup,
   FormControlLabel,
   Checkbox,
   Typography,
} from '@mui/material';

interface Option {
   label: string;
   value: string;
}

/**
 * Свойства компонента FilterGroup.
 *
 * @param legend    Заголовок группы фильтров.
 * @param options   Список опций для отображения (label/value).
 * @param selected  Массив выбранных меток (label).
 * @param onToggle  Функция-колбэк для переключения выбора опции.
 */
interface FilterGroupProps {
   legend: string;
   options: Option[];
   selected: string[];
   onToggle: (label: string) => void;
}

/**
 * Компонент группы чекбоксов для фильтрации.
 *
 * Показывает заголовок и список опций, каждая с чекбоксом.
 * Позволяет выбирать/снимать выбор нескольких опций.
 */
export function FilterGroup({
                               legend,
                               options,
                               selected,
                               onToggle,
                            }: FilterGroupProps) {
   return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
         <FormControl component="fieldset" fullWidth>
            {/* Заголовок группы фильтра */}
            <FormLabel component="legend" sx={{ mb: 1, color: 'primary.dark' }}>
               {legend}
            </FormLabel>

            {/* Список опций с чекбоксами */}
            <FormGroup>
               {options.map(opt => (
                  <FormControlLabel
                     key={opt.value}
                     control={
                        <Checkbox
                           checked={selected.includes(opt.label)}
                           onChange={() => onToggle(opt.label)}
                        />
                     }
                     label={
                        <Typography sx={{ color: 'text.primary' }}>
                           {opt.label}
                        </Typography>
                     }
                  />
               ))}
            </FormGroup>
         </FormControl>
      </Paper>
   );
}
