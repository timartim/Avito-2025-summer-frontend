// src/constants/taskStatus.ts
export const TASK_STATUSES = [
   { key: 'Backlog', label: 'Не начато' },
   { key: 'InProgress', label: 'В процессе' },
   { key: 'Done', label: 'Завершено' },
] as const;
export type TaskStatusKey = typeof TASK_STATUSES[number]['key'];
