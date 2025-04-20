/* -------------------------------------------------------------------------- */
/*                            Типы и базовые наборы                           */
/* -------------------------------------------------------------------------- */

/**
 * Пара «строковый код → русское название».
 *
 * @template V  Строгий строковой код, которым оперирует бек‑енд
 * @template L  Локализованная подпись, показываемая в UI
 */
type Pair<V extends string, L extends string> = { value: V; ru: L };

/**
 * **PRIORITY_PAIRS**
 *
 * Единый источник истины по всем приоритетам в приложении.
 * Достаточно изменить очередность или добавить элемент
 * — и все производные константы (`PRIORITY_LABELS`, `priorityOptions`,
 * а также словари из `taskMappings.ts`) обновятся автоматически.
 */
export const PRIORITY_PAIRS = [
   { value: 'Low',    ru: 'Низкий'  },
   { value: 'Medium', ru: 'Средний' },
   { value: 'High',   ru: 'Высокий' },
] as const satisfies readonly Pair<'Low' | 'Medium' | 'High', string>[];

/**
 * **STATUS_PAIRS**
 *
 * Аналогичный перечень для статусов выполнения задачи.
 */
export const STATUS_PAIRS = [
   { value: 'Backlog',    ru: 'Не начато'  },
   { value: 'InProgress', ru: 'В процессе' },
   { value: 'Done',       ru: 'Выполнено'  },
] as const satisfies readonly Pair<'Backlog' | 'InProgress' | 'Done', string>[];

/* -------------------------------------------------------------------------- */
/*                              Произведённые данные                          */
/* -------------------------------------------------------------------------- */

/**
 * Чистые массивы русских подписи, удобны когда нужен
 * только **текст** (например, в качестве заголовков таблицы/колонок).
 *
 * @example
 * console.log(PRIORITY_LABELS); // ["Низкий","Средний","Высокий"]
 */
export const PRIORITY_LABELS = PRIORITY_PAIRS.map(p => p.ru) as readonly string[];
export const STATUS_LABELS   = STATUS_PAIRS  .map(p => p.ru) as readonly string[];

/**
 * Готовые объекты для `<Select>` / `<Autocomplete>` компонентов MUI:
 * ```ts
 * { label: 'Высокий', value: 'High' }
 * ```
 * Благодаря `as const` типы значений остаются литеральными.
 */
export const priorityOptions = PRIORITY_PAIRS.map(({ value, ru }) => ({ label: ru, value })) as const;
export const statusOptions   = STATUS_PAIRS  .map(({ value, ru }) => ({ label: ru, value })) as const;
