import { Navigate, Route, Routes } from 'react-router-dom';
import AllBoards from '../Pages/AllBoards.tsx';
import AllTasks from '../Pages/AllTasks.tsx';
import BoardTasks from '../Pages/BoardTasks.tsx';
import NotFoundPage from '../Pages/NotFoundPage.tsx';

export default function RoutesConfig(){
   return (
      <Routes>
         <Route path="/" element={<Navigate to="/issues" replace />} />
         <Route path="/boards" element={<AllBoards />} />
         <Route path="/issues" element={<AllTasks />} />
         <Route path="/board/:id" element={<BoardTasks />} />
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
   )
}