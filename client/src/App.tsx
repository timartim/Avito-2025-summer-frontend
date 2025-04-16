import React from 'react';
import './App.css';
import { lightTheme } from './Styles/lightTheme';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import RouteControl from './Components/Routes/RoutesControl.tsx';
import { store } from './Components/ReduxStore/store.ts';
import { Provider } from 'react-redux';

function App() {
   return (
      <Provider store={store}>
         <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Router>
               <RouteControl />
            </Router>
         </ThemeProvider>
      </Provider>
   );
}

export default App;
