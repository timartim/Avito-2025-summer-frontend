// src/hooks/useTaskDrafts.ts

import { useState, useCallback } from 'react';
import { TASK_DRAFTS_KEY } from '../Components/Constants/storageKeys.ts';
import { Task } from '../Interfaces/appInterfaces.ts';

/**
 * Хук для работы с черновиками задач в localStorage.
 *
 * Позволяет:
 * - Загружать список черновиков из localStorage по ключу TASK_DRAFTS_KEY.
 * - Удалять конкретный черновик по индексу.
 * - Сохранять обновлённый список черновиков обратно в localStorage.
 *
 * @returns Объект с полями:
 *  - drafts: текущий массив черновиков (Partial<Task>[]).
 *  - load: функция для повторной загрузки черновиков из localStorage.
 *  - remove: функция для удаления черновика по индексу.
 */
export function useTaskDrafts() {
   // Инициализация состояния: читаем из localStorage или возвращаем пустой массив
   const [drafts, setDrafts] = useState<Partial<Task>[]>(() => {
      try {
         return JSON.parse(localStorage.getItem(TASK_DRAFTS_KEY) || '[]');
      } catch {
         // В случае ошибки парсинга возвращаем пустой список
         return [];
      }
   });

   /**
    * Сохраняет переданный массив черновиков в localStorage и обновляет состояние.
    *
    * @param items Массив черновиков для сохранения
    */
   const save = useCallback((items: Partial<Task>[]) => {
      localStorage.setItem(TASK_DRAFTS_KEY, JSON.stringify(items));
      setDrafts(items);
   }, []);

   /**
    * Перезагружает список черновиков из localStorage в состояние.
    * Использовать, если данные могли измениться извне.
    */
   const load = useCallback(() => {
      try {
         const items = JSON.parse(localStorage.getItem(TASK_DRAFTS_KEY) || '[]');
         setDrafts(items);
      } catch {
         // Если что-то пошло не так, очищаем состояние
         setDrafts([]);
      }
   }, []);

   /**
    * Удаляет черновик по указанному индексу и сохраняет обновлённый список.
    *
    * @param idx Индекс черновика, который нужно удалить
    */
   const remove = useCallback(
      (idx: number) => {
         const items = drafts.filter((_, i) => i !== idx);
         save(items);
      },
      [drafts, save]
   );

   return { drafts, load, remove };
}
