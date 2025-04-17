
import { createTheme } from '@mui/material/styles';
import { Theme } from '@emotion/react';

export const lightTheme: Theme = createTheme({
   palette: {
      mode: 'light',
      primary: {
         main: '#00AAFF',
         light: '#66CBFF',
         dark: '#007ACC',
         contrastText: '#FFFFFF',
      },
      secondary: {
         main: '#FF6163',
         light: '#FF8A8C',
         dark: '#CC5153',
         contrastText: '#FFFFFF',
      },
      success:   { main: '#97CF26', contrastText: '#212121' },
      info:      { main: '#A169F7', contrastText: '#FFFFFF' },
      background:{
         default: '#FFFFFF',
         paper:   '#F5F5F5',
      },
      text: {
         primary:   '#212121',
         secondary: '#757575',
         disabled:  '#BDBDBD',
      },
      common: {
         black: '#000000',
         white: '#FFFFFF',
      },
   },
   typography: {
      fontFamily: ['Arial', 'sans-serif'].join(','),
      allVariants: { fontSize: 16, color: '#212121' },
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
   },
});
