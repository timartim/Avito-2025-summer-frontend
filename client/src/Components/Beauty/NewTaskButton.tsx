// src/components/Task/NewTaskButton.tsx
import React from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Props {
   onClick: () => void;
}

export function NewTaskButton({ onClick }: Props) {
   return (
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
            <AddIcon />
         </IconButton>
      </Box>
   );
}
