// App.tsx
import React, { useState } from 'react';
import './App.css';
import { lightTheme } from './Styles/lightTheme';
import { darkTheme } from './Styles/darkTheme.ts';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import RouteControl from './Components/Routes/RoutesControl';
import { store } from './Components/ReduxStore/store';
import { Provider } from 'react-redux';
import { useMediaQuery } from '@mui/material';

export type ThemeMode = 'system' | 'light' | 'dark';

function App() {
   const [mode, setMode] = useState<ThemeMode>('system');

   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
   const appliedTheme =
      mode === 'system'
         ? prefersDark
            ? darkTheme
            : lightTheme
         : mode === 'dark'
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
