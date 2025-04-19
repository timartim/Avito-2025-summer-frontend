// src/components/Task/SearchAndFilterBar.tsx
import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Props {
   search: string;
   onSearch: (value: string) => void;
   onOpenFilter: () => void;
}

export function SearchAndFilterBar({ search, onSearch, onOpenFilter }: Props) {
   return (
      <Box sx={{ display: 'flex', mb: 2 }}>
         <TextField
            label="Поиск"
            value={search}
            onChange={e => onSearch(e.target.value)}
            sx={{ flexGrow: 1, mr: 2, maxWidth: 500 }}
         />
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
