// src/hooks/useLocalStorage.ts
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
   const [value, setValue] = useState<T>(() => {
      try {
         const item = localStorage.getItem(key);
         return item ? JSON.parse(item) : initialValue;
      } catch {
         return initialValue;
      }
   });

   useEffect(() => {
      try {
         localStorage.setItem(key, JSON.stringify(value));
      } catch {}
   }, [key, value]);

   return [value, setValue];
}
