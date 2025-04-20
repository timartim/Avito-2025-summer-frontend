// src/hooks/useBoardTasks.ts

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../ReduxStore/store.ts';
import {
   fetchBoardTasks,
   selectBoardTasks,
   selectCurrentBoard,
   selectLoading as selectBoardLoading,
   selectError as selectBoardError,
} from '../ReduxSlices/dataSlice.ts';

/**
 * Хук для загрузки и получения задач выбранной доски.
 *
 * При изменении boardId и несовпадении с текущей загруженной доской
 * автоматически диспатчит запрос fetchBoardTasks для получения задач.
 *
 * @param boardId - идентификатор доски, задачи которой нужно загрузить
 * @returns объект с полями:
 *   grouped - задачи, сгруппированные по статусам (Backlog, InProgress, Done)
 *   loading - флаг, указывающий на процесс загрузки
 *   error - текст ошибки при неудачной загрузке
 */
export function useBoardTasks(boardId: number) {
   const dispatch = useDispatch<AppDispatch>();

   // Селектор группированных задач по статусам
   const grouped = useSelector(selectBoardTasks);

   // Текущий ID загруженной доски, нужен чтобы не перезапрашивать одни и те же данные
   const current = useSelector(selectCurrentBoard);

   // Флаги загрузки и ошибки для UI
   const loading = useSelector(selectBoardLoading);
   const error = useSelector(selectBoardError);

   useEffect(() => {
      // Загружаем задачи, если текущая доска не совпадает с переданной
      if (current !== boardId) {
         dispatch(fetchBoardTasks(boardId));
      }
   }, [dispatch, boardId, current]);

   return { grouped, loading, error };
}
