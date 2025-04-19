// src/hooks/useTaskDrafts.ts
import { useState, useCallback } from 'react';
import { TASK_DRAFTS_KEY } from '../Constants/storageKeys';
import { Task } from '../Interfaces/appInterfaces';

export function useTaskDrafts() {
   const [drafts, setDrafts] = useState<Partial<Task>[]>(() => {
      try {
         return JSON.parse(localStorage.getItem(TASK_DRAFTS_KEY) || '[]');
      } catch {
         return [];
      }
   });

   const save = useCallback((items: Partial<Task>[]) => {
      localStorage.setItem(TASK_DRAFTS_KEY, JSON.stringify(items));
      setDrafts(items);
   }, []);

   const load = useCallback(() => {
      try {
         const items = JSON.parse(localStorage.getItem(TASK_DRAFTS_KEY) || '[]');
         setDrafts(items);
      } catch {
         setDrafts([]);
      }
   }, []);

   const remove = useCallback((idx: number) => {
      const items = drafts.filter((_, i) => i !== idx);
      save(items);
   }, [drafts, save]);

   return { drafts, load, remove };
}
