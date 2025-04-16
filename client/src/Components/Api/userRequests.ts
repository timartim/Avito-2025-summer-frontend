// apiUsers.ts
import { apiRequest } from './apiRequest';

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

export interface UserTask {
   id: number;
   title: string;
   description: string;
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | 'Low' | 'Medium' | 'High' | string;
   status: 'Не начато' | 'В процессе' | 'Выполнено' | 'ToDo' | 'InProgress' | 'Done' | string;
   boardName: string;
}

export async function getUsers(): Promise<UserFull[]> {

   const response = await apiRequest<{ data: UserFull[] }>('get', '/users');
   return response.data;
}


export async function getUserTasks(userId: number): Promise<UserTask[]> {
   const response = await apiRequest<{ data: UserTask[] }>('get', `/users/${userId}/tasks`);
   return response.data;
}
