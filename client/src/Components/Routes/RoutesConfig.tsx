// src/Routes/RoutesConfig.tsx

/**
 * Компонент настройки маршрутов приложения.
 *
 * Здесь определяется структура URL и соответствующие им React-компоненты:
 * - перенаправление с "/" на "/issues",
 * - список всех досок (/boards),
 * - список всех задач (/issues),
 * - страница конкретной доски по её ID (/board/:id),
 * - страница 404 для всех остальных путей.
 *
 * Использует возможности react-router-dom v6.
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import AllBoards from '../Pages/AllBoards.tsx';
import AllTasks from '../Pages/AllTasks.tsx';
import BoardTasks from '../Pages/BoardTasks.tsx';
import NotFoundPage from '../Pages/NotFoundPage.tsx';

export default function RoutesConfig() {
   return (
      <Routes>
         {/*
            Корень приложения:
            перенаправляем пользователя с "/" на "/issues" (список задач).
         */}
         <Route path="/" element={<Navigate to="/issues" replace />} />

         {/*
            Страница со списком всех досок.
            Компонент AllBoards отображает доступные доски и кнопки для навигации к ним.
         */}
         <Route path="/boards" element={<AllBoards />} />

         {/*
            Главная страница задач:
            компонент AllTasks отображает поиск, фильтрацию и список задач.
         */}
         <Route path="/issues" element={<AllTasks />} />

         {/*
            Страница конкретной доски:
            компонент BoardTasks показывает доску по ID, позволяет перетаскивать задачи между статусами.
         */}
         <Route path="/board/:id" element={<BoardTasks />} />

         {/*
            Обработчик всех прочих путей:
            если пользователь пытается открыть несуществующий маршрут,
            показываем страницу 404.
         */}
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
   );
}
