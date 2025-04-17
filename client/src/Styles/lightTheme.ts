// theme/lightTheme.ts
import { createTheme } from '@mui/material/styles';
import { Theme } from '@emotion/react';

export const lightTheme: Theme = createTheme({
   palette: {
      mode: 'light',
      primary: { main: '#BDBDBD', dark: '#424242'},
      secondary: { main: '#424242' },
      background: { default: '#F5F5F5', paper: '#EEEEEE' },
      text: { primary: '#424242', secondary: '#757575' },
   },
   typography: {
      fontFamily: ['Arial', 'sans-serif'].join(','),
      allVariants: { fontSize: 20, color: '#424242' },
      h1: { fontWeight: 700, fontSize: '3rem', color: '#424242' },
      h2: { fontWeight: 700, fontSize: '2.25rem', color: '#424242' },
   },


   components: {
      MuiButtonBase: {
         defaultProps: {
            disableRipple: true,
         },
         styleOverrides: {
            root: {
               '&.Mui-focusVisible': { outline: 'none' },
            },
         },
      },

      MuiButton: {
         styleOverrides: {
            root: {
               borderRadius: 0,
               textTransform: 'none',
               fontWeight: 500,
               '&:hover': { backgroundColor: '#E0E0E0' },
            },
         },
      },
   },
});
