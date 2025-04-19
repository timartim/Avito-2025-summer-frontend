// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { lightTheme } from './Styles/lightTheme';
import { darkTheme } from './Styles/darkTheme';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import RouteControl from './Components/Routes/RoutesControl';
import { store } from './Components/ReduxStore/store';
import { Provider } from 'react-redux';
import { APP_THEME_KEY, ThemeModes, ThemeMode } from './Components/Constants/storageKeys.ts';

function App() {
   const [mode, setMode] = useState<ThemeMode>(() => {
      return (localStorage.getItem(APP_THEME_KEY) as ThemeMode) || ThemeModes.System;
   });

   useEffect(() => {
      localStorage.setItem(APP_THEME_KEY, mode);
   }, [mode]);

   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
   const appliedTheme =
      mode === ThemeModes.System
         ? prefersDark
            ? darkTheme
            : lightTheme
         : mode === ThemeModes.Dark
            ? darkTheme
            : lightTheme;

   return (
      <Provider store={store}>
         <ThemeProvider theme={appliedTheme}>
            <CssBaseline />
            <Router>
               <RouteControl mode={mode} onModeChange={setMode} />
            </Router>
         </ThemeProvider>
      </Provider>
   );
}

export default App;
