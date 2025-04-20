/**
 * Главный компонент приложения.
 * Здесь объединяется **Redux‑store**, **React‑Router** и переключение
 * светлой/тёмной темы MUI.
 *
 * Алгоритм работы:
 *  1. При первом рендере берём режим темы из `localStorage`
 *     (ключ `APP_THEME_KEY`) либо «system».
 *  2. Сохраняем выбранный режим обратно каждый раз при изменении `mode`.
 *  3. Если пользователь выбрал «System», подстраиваемся под media‑query
 *     `prefers-color-scheme`.
 *  4. Заворачиваем всё приложение в:
 *        – `<Provider>` для Redux
 *        – `<ThemeProvider>` — передаём сгенерированную тему
 *        – `<Router>` с собственным компонентом `RouteControl`
 *
 * Замечания:
 * • Логика выбора темы проста — достаточно двух готовых объектов `lightTheme`
 *   и `darkTheme`.
 * • Обновлять `mode` может `RouteControl` (через проп `onModeChange`).
 */

import React, { useState, useEffect } from 'react';
import './App.css';

import { lightTheme } from './Styles/lightTheme';
import { darkTheme  } from './Styles/darkTheme';

import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';

import RouteControl from './Components/Routes/RoutesControl';
import { store }      from './ReduxStore/store';
import { Provider }   from 'react-redux';

import {
   APP_THEME_KEY,
   ThemeModes,
   ThemeMode,
} from './Components/Constants/storageKeys.ts';

function App() {
   /* ----------------------------------------------------------------------- */
   /*                     Состояние и сохранение режима темы                  */
   /* ----------------------------------------------------------------------- */
   const [mode, setMode] = useState<ThemeMode>(() => {
      // читаем сохранённое значение или берём «system» по умолчанию
      return (localStorage.getItem(APP_THEME_KEY) as ThemeMode) || ThemeModes.System;
   });

   // при изменении режима кладём его в localStorage
   useEffect(() => {
      localStorage.setItem(APP_THEME_KEY, mode);
   }, [mode]);

   /* ----------------------------------------------------------------------- */
   /*                            Выбираем тему MUI                            */
   /* ----------------------------------------------------------------------- */
   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

   const appliedTheme =
      mode === ThemeModes.System
         ? prefersDark
            ? darkTheme
            : lightTheme
         : mode === ThemeModes.Dark
            ? darkTheme
            : lightTheme;

   /* ----------------------------------------------------------------------- */
   /*                               Render                                     */
   /* ----------------------------------------------------------------------- */
   return (
      <Provider store={store}>
         <ThemeProvider theme={appliedTheme}>
            <CssBaseline /> {/* Сброс браузерных стилей от MUI */}
            <Router>
               {/* Компонент «шапка + роуты» получает текущий режим и коллбэк */}
               <RouteControl mode={mode} onModeChange={setMode} />
            </Router>
         </ThemeProvider>
      </Provider>
   );
}

export default App;
