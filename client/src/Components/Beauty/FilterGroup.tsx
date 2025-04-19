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

interface Option { label: string; value: string }
interface FilterGroupProps {
   legend: string;
   options: Option[];
   selected: string[];
   onToggle: (label: string) => void;
}

export function FilterGroup({
                               legend,
                               options,
                               selected,
                               onToggle,
                            }: FilterGroupProps) {
   return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
         <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 1, color: 'primary.dark' }}>
               {legend}
            </FormLabel>
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
