// theme/avitoDarkTheme.ts
import { createTheme } from '@mui/material/styles';
import { Theme } from '@emotion/react';

export const darkTheme: Theme = createTheme({
   palette: {
      mode: 'dark',
      primary: {
         main: '#00AAFF',
         light: '#66CBFF',
         dark: '#007ACC',
         contrastText: '#000000',
      },
      secondary: {
         main: '#FF6163',
         light: '#FF8A8C',
         dark: '#CC5153',
         contrastText: '#000000',
      },
      success:   { main: '#97CF26', contrastText: '#000000' },
      info:      { main: '#A169F7', contrastText: '#000000' },
      background:{
         default: '#121212',
         paper:   '#1E1E1E',
      },
      text: {
         primary:   '#FFFFFF',
         secondary: 'rgba(255,255,255,0.7)',
         disabled:  'rgba(255,255,255,0.5)',
      },
      common: {
         black: '#000000',
         white: '#FFFFFF',
      },
      divider: 'rgba(255,255,255,0.12)',
      action: {
         active:  '#FFFFFF',
         hover:   'rgba(255,255,255,0.08)',
         selected:'rgba(255,255,255,0.16)',
         disabled:'rgba(255,255,255,0.3)',
         disabledBackground:'rgba(255,255,255,0.12)',
      },
   },
   typography: {
      fontFamily: ['Arial','sans-serif'].join(','),
      allVariants: { fontSize: 16, color: '#FFFFFF' },
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 700, fontSize: '2rem' },
   },
   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               borderRadius: 0,
               textTransform: 'none',
               color: '#FFFFFF',
               '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
            },
         },
      },
      MuiCssBaseline: {
         styleOverrides: {
            body: {
               backgroundColor: '#121212',
            },
         },
      },
   },
});
