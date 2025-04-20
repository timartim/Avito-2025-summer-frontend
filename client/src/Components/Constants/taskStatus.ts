// src/constants/taskStatus.ts

/**
 * Список возможных статусов задач и их русские наименования.
 * Используется для построения столбцов доски задач и отображения статусов в UI.
 */
export const TASK_STATUSES = [
   { key: 'Backlog', label: 'Не начато' },
   { key: 'InProgress', label: 'В процессе' },
   { key: 'Done', label: 'Завершено' },
] as const;

/**
 * Тип ключа статуса задачи.
 * Берётся из массива TASK_STATUSES: 'Backlog' | 'InProgress' | 'Done'
 */
export type TaskStatusKey = typeof TASK_STATUSES[number]['key'];
