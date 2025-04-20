// src/hooks/useLocalStorage.ts

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * Кастомный хук для синхронизации состояния с localStorage.
 *
 * При инициализации считывает значение по ключу key из localStorage.
 * Если в хранилище нет данных или происходит ошибка при чтении, используется initialValue.
 * При каждом изменении value записывает новое значение в localStorage.
 *
 * @template T Тип хранимого значения
 * @param key Ключ для хранения в localStorage
 * @param initialValue Начальное значение, используемое при отсутствии данных в localStorage
 * @returns Пару [value, setValue]:
 *  - value: текущее значение из состояния (и localStorage)
 *  - setValue: функция для обновления значения (аналогично useState)
 */
export function useLocalStorage<T>(
   key: string,
   initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
   // Инициализация состояния: пытаемся загрузить из localStorage
   const [value, setValue] = useState<T>(() => {
      try {
         const item = localStorage.getItem(key);
         return item ? JSON.parse(item) : initialValue;
      } catch {
         return initialValue;
      }
   });

   // При изменении key или value сохраняем в localStorage
   useEffect(() => {
      try {
         localStorage.setItem(key, JSON.stringify(value));
      } catch {
         // Игнорируем ошибки, например, если переполнено хранилище
      }
   }, [key, value]);

   return [value, setValue];
}
