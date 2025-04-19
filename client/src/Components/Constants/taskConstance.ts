// src/Constants/taskConstants.ts
export const priorityOptions = [
   { label: 'Небольшое', value: 'Low' },
   { label: 'Среднее', value: 'Medium' },
   { label: 'Высокое', value: 'High' },
] as const;

export const statusOptions = [
   { label: 'Не начато', value: 'Backlog' },
   { label: 'В процессе', value: 'InProgress' },
   { label: 'Выполнено', value: 'Done' },
] as const;
