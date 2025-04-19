export interface Board {
   id: number;
   name: string;
   description: string;
   taskCount: number;
}

export interface Assignee {
   id: number;
   fullName: string;
   email: string;
   avatarUrl: string;
}
export interface Task {
   id?: number;
   title: string;
   description: string;
   priority: 'Low' | 'Medium' | 'High' | string;
   status?: 'Backlog' | 'InProcess' | 'Completed' | string;
   assigneeId: number;
   assignee: Assignee;
   boardName: string;
   boardId: number;
}
export interface UserFull {
   id: number;
   fullName: string;
   email: string;
   avatarUrl: string;
   description?: string;
   tasksCount: number;
   teamId: number;
   teamName: string;
}

export interface Team {
   id: number;
   name: string;
   description: string;
   boardsCount: number;
   usersCount: number;
}


export interface User {
   id: number;
   fullName: string;
   email: string;
   avatarUrl: string;
   description?: string;
}

export interface TeamDetail {
   id: number;
   name: string;
   description: string;
   boards: Board[];
   users: User[];
}

export interface CreateTaskInput {
   assigneeId: number;
   boardId: number;
   description: string;
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | string;
   title: string;
}
export interface UserTask {
   id: number;
   title: string;
   description: string;
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | 'Low' | 'Medium' | 'High' | string;
   status: 'Не начато' | 'В процессе' | 'Выполнено' | 'ToDo' | 'InProgress' | 'Done' | string;
   boardName: string;
}

export interface UpdateTaskInput {
   assigneeId: number;
   description: string;
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | string;
   status: 'Не начато' | 'В процессе' | 'Выполнено' | string;
   title: string;
}




export type Priority = 'Небольшое' | 'Среднее' | 'Высокое';
export type Status = 'Не начато' | 'В процессе' | 'Выполнено';

