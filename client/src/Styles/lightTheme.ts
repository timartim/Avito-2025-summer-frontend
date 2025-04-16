import { createTheme } from '@mui/material/styles';
import { Theme } from '@emotion/react';

export const lightTheme: Theme = createTheme({
   palette: {
      mode: 'light',
      primary: {
         // Основной оттенок – средний серый
         main: '#BDBDBD',
      },
      secondary: {
         // Второстепенный оттенок – светлый серый
         main: '#E0E0E0',
      },
      background: {
         // Фон приложения – очень светлый серый, почти белый
         default: '#F5F5F5',
         // Фон для карточек и поверхностей – чуть темнее
         paper: '#EEEEEE',
      },
      text: {
         // Для хорошего контраста используем тёмно-серый
         primary: '#424242',
         secondary: '#757575',
      },
   },
   typography: {
      fontFamily: ['Arial', 'sans-serif'].join(','),
      allVariants: {
         fontSize: '20px',
         color: '#424242',
      },
      h1: {
         fontWeight: 700,
         fontSize: '3rem',
         color: '#424242',
      },
      h2: {
         fontWeight: 700,
         fontSize: '2.25rem',
         color: '#424242',
      },
   },
   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               borderRadius: 0,
               textTransform: 'none',
               fontWeight: 500,
               '&:hover': {
                  // При наведении используем чуть более светлый оттенок второстепенного цвета
                  backgroundColor: '#E0E0E0',
               },
            },
         },
      },
   },
});
