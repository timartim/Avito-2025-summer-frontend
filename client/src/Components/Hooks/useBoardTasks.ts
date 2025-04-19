// src/hooks/useBoardTasks.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../ReduxStore/store';
import {
   fetchBoardTasks,
   selectBoardTasks,
   selectCurrentBoard,
   selectLoading as selectBoardLoading,
   selectError as selectBoardError,
} from '../ReduxSlices/dataSlice';

export function useBoardTasks(boardId: number) {
   const dispatch = useDispatch<AppDispatch>();
   const grouped = useSelector(selectBoardTasks);
   const current = useSelector(selectCurrentBoard);
   const loading = useSelector(selectBoardLoading);
   const error = useSelector(selectBoardError);

   useEffect(() => {
      if (current !== boardId) {
         dispatch(fetchBoardTasks(boardId));
      }
   }, [dispatch, boardId, current]);

   return { grouped, loading, error };
}
