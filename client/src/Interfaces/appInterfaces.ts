// src/Interfaces/appInterfaces.ts

/**
 * Описание доски (проекта).
 */
export interface Board {
   /** Уникальный идентификатор доски */
   id: number;
   /** Название доски */
   name: string;
   /** Описание доски */
   description: string;
   /** Количество задач, привязанных к доске */
   taskCount: number;
}

/**
 * Информация об исполнителе задачи.
 */
export interface Assignee {
   /** Уникальный идентификатор пользователя */
   id: number;
   /** Полное имя пользователя */
   fullName: string;
   /** Электронная почта пользователя */
   email: string;
   /** URL аватарки пользователя */
   avatarUrl: string;
}

/**
 * Описание задачи.
 */
export interface Task {
   /** Уникальный идентификатор задачи (может быть undefined для новых задач) */
   id?: number;
   /** Заголовок задачи */
   title: string;
   /** Подробное описание задачи */
   description: string;
   /** Приоритет задачи (Low, Medium, High или кастомное значение) */
   priority: 'Low' | 'Medium' | 'High' | string;
   /** Статус задачи (Backlog, InProcess, Completed или кастомное значение) */
   status?: 'Backlog' | 'InProcess' | 'Completed' | string;
   /** Идентификатор исполнителя задачи */
   assigneeId: number;
   /** Данные исполнителя (если загружены) */
   assignee?: Assignee;
   /** Название доски, к которой привязана задача */
   boardName: string;
   /** Идентификатор доски, к которой привязана задача */
   boardId: number;
}

/**
 * Полные данные о пользователе.
 */
export interface UserFull {
   /** Уникальный идентификатор пользователя */
   id: number;
   /** Полное имя пользователя */
   fullName: string;
   /** Электронная почта пользователя */
   email: string;
   /** URL аватарки пользователя */
   avatarUrl: string;
   /** Описание пользователя (необязательно) */
   description?: string;
   /** Количество задач у пользователя */
   tasksCount: number;
   /** Идентификатор команды пользователя */
   teamId: number;
   /** Название команды пользователя */
   teamName: string;
}

/**
 * Краткая информация о команде.
 */
export interface Team {
   /** Уникальный идентификатор команды */
   id: number;
   /** Название команды */
   name: string;
   /** Описание команды */
   description: string;
   /** Количество досок в команде */
   boardsCount: number;
   /** Количество пользователей в команде */
   usersCount: number;
}

/**
 * Подробные данные команды и связанные сущности.
 */
export interface TeamDetail {
   /** Уникальный идентификатор команды */
   id: number;
   /** Название команды */
   name: string;
   /** Описание команды */
   description: string;
   /** Список досок команды */
   boards: Board[];
   /** Список пользователей команды */
   users: User[];
}

/**
 * Базовая информация о пользователе.
 */
export interface User {
   /** Уникальный идентификатор пользователя */
   id: number;
   /** Полное имя пользователя */
   fullName: string;
   /** Электронная почта пользователя */
   email: string;
   /** URL аватарки пользователя */
   avatarUrl: string;
   /** Описание пользователя (необязательно) */
   description?: string;
}

/**
 * Входные данные для создания новой задачи через API.
 */
export interface CreateTaskInput {
   /** Идентификатор исполнителя */
   assigneeId: number;
   /** Идентификатор доски */
   boardId: number;
   /** Описание задачи */
   description: string;
   /** Приоритет на русском языке */
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | string;
   /** Заголовок задачи */
   title: string;
}

/**
 * Структура задачи в контексте пользователя.
 */
export interface UserTask {
   /** Уникальный идентификатор задачи */
   id: number;
   /** Заголовок задачи */
   title: string;
   /** Описание задачи */
   description: string;
   /** Приоритет задачи (русские или английские варианты) */
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | 'Low' | 'Medium' | 'High' | string;
   /** Статус задачи (русские или английские варианты) */
   status: 'Не начато' | 'В процессе' | 'Выполнено' | 'ToDo' | 'InProgress' | 'Done' | string;
   /** Название доски */
   boardName: string;
}

/**
 * Входные данные для обновления существующей задачи через API.
 */
export interface UpdateTaskInput {
   /** Идентификатор исполнителя */
   assigneeId: number;
   /** Описание задачи */
   description: string;
   /** Приоритет на русском языке */
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | string;
   /** Статус на русском языке */
   status: 'Не начато' | 'В процессе' | 'Выполнено' | string;
   /** Заголовок задачи */
   title: string;
}

/** Возможные значения приоритета на русском языке */
export type Priority = 'Небольшое' | 'Среднее' | 'Высокое';

/** Возможные значения статуса на русском языке */
export type Status = 'Не начато' | 'В процессе' | 'Выполнено';
