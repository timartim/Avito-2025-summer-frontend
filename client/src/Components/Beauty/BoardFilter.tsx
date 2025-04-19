// src/Components/Filter/BoardFilter.tsx
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
import { Board } from '../../Interfaces/appInterfaces';

interface BoardFilterProps {
   boards: Board[];
   filteredBoards: Board[];
   search: string;
   onSearch: (v: string) => void;
   selected: string[];
   onToggle: (label: string) => void;
}

export function BoardFilter({
                               boards,
                               filteredBoards,
                               search,
                               onSearch,
                               selected,
                               onToggle,
                            }: BoardFilterProps) {
   return (
      <Paper variant="outlined" sx={{ p: 2 }}>
         <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 1, color: 'primary.dark' }}>
               Доски
            </FormLabel>
            <TextField
               label="Поиск доски"
               size="small"
               value={search}
               onChange={e => onSearch(e.target.value)}
               sx={{ mb: 2 }}
            />
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
