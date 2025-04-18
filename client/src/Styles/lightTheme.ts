// src/Styles/lightTheme.ts
import { createTheme } from '@mui/material/styles';
import { Theme } from '@emotion/react';

export const lightTheme: Theme = createTheme({
   palette: {
      mode: 'light',
      primary: { main: '#00AAFF', light: '#66CBFF', dark: '#007ACC', contrastText: '#FFF' },
      secondary: { main: '#FF6163', light: '#FF8A8C', dark: '#CC5153', contrastText: '#FFF' },
      success:   { main: '#97CF26', contrastText: '#212121' },
      info:      { main: '#A169F7', contrastText: '#FFF' },
      background:{ default: '#FFF', paper: '#F5F5F5' },
      text:      { primary: '#212121', secondary: '#757575', disabled: '#BDBDBD' },
      common:    { black: '#000', white: '#FFF' },
   },
   typography: {
      fontFamily: ['Arial','sans-serif'].join(','),
      allVariants: { fontSize: '20px', color: '#212121' },
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 700, fontSize: '2rem' },
   },
   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               borderRadius: 0,
               textTransform: 'none',
            },
         },
      },

      MuiCssBaseline: {
         styleOverrides: {
            '*::-webkit-scrollbar': {
               width: '8px',
               height: '8px',
            },
            '*::-webkit-scrollbar-track': {
               background: '#e0e0e0',
            },
            '*::-webkit-scrollbar-thumb': {
               backgroundColor: '#9e9e9e',
               borderRadius: '4px',
               border: '2px solid #e0e0e0',
            },
            /* Firefox */
            '*': {
               scrollbarWidth: 'thin',
               scrollbarColor: '#9e9e9e #e0e0e0',
            },
         },
      },
   },
});
