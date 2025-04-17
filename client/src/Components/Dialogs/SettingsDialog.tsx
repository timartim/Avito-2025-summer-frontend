// Components/Beauty/SettingsDialog.tsx
import React from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
} from '@mui/material';
import { ThemeMode } from '../../App';

interface Props {
   open: boolean;
   mode: ThemeMode;
   onClose: () => void;
   onChange: (mode: ThemeMode) => void;
}

const SettingsDialog: React.FC<Props> = ({ open, mode, onClose, onChange }) => {
   return (
      <Dialog open={open} onClose={onClose}>
         <DialogTitle>Настройки</DialogTitle>
         <DialogContent>
            <FormControl fullWidth sx={{ mt: 1, minWidth: 200 }}>
               <InputLabel id="theme-select-label">Тема</InputLabel>
               <Select
                  labelId="theme-select-label"
                  value={mode}
                  label="Тема"
                  onChange={(e) => onChange(e.target.value as ThemeMode)}
               >
                  <MenuItem value="system">Системная</MenuItem>
                  <MenuItem value="light">Светлая</MenuItem>
                  <MenuItem value="dark">Тёмная</MenuItem>
               </Select>
            </FormControl>
         </DialogContent>
         <DialogActions>
            <Button onClick={onClose} color="primary">Отменить</Button>
            <Button onClick={onClose} variant="contained" color="primary">OK</Button>
         </DialogActions>
      </Dialog>
   );
};

export default SettingsDialog;
