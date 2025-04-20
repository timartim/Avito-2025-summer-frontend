import { PRIORITY_PAIRS, STATUS_PAIRS } from './taskConstance.ts';

/**
 * Объект‑«словарь» для прямого преобразования
 * **человекочитаемых русских** названий приоритета/статуса
 * → внутренних **строковых кодов**, которыми оперирует сервер.
 *
 * @example
 * prioritiesStatusesToServer.priority['Высокий']  // "High"
 * prioritiesStatusesToServer.status['В процессе'] // "InProgress"
 */
export const prioritiesStatusesToServer = {
   priority: PRIORITY_PAIRS.reduce<Record<string, string>>(
      (acc, { ru, value }) => {
         acc[ru] = value;
         return acc;
      },
      {},
   ),
   status: STATUS_PAIRS.reduce<Record<string, string>>(
      (acc, { ru, value }) => {
         acc[ru] = value;
         return acc;
      },
      {},
   ),
} as const;

/**
 * Обратный «словарь» для конвертации
 * **серверных строковых кодов** приоритета/статуса
 * → читаемые **русские подписи** (UI‑представление).
 *
 * @example
 * prioritiesStatusesToRu.priority['High']      // "Высокий"
 * prioritiesStatusesToRu.status['Backlog']     // "Не начато"
 */
export const prioritiesStatusesToRu = {
   priority: PRIORITY_PAIRS.reduce<Record<string, string>>(
      (acc, { ru, value }) => {
         acc[value] = ru;
         return acc;
      },
      {},
   ),
   status: STATUS_PAIRS.reduce<Record<string, string>>(
      (acc, { ru, value }) => {
         acc[value] = ru;
         return acc;
      },
      {},
   ),
} as const;
