// apiRequests.ts
import { apiRequest } from './apiRequest';


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


export type Priority = 'Небольшое' | 'Среднее' | 'Высокое';
export type Status = 'Не начато' | 'В процессе' | 'Выполнено';

// Интерфейс для задачи
export interface Task {
   id: number;
   title: string;
   description: string;
   priority: Priority;
   status: Status;
   assignee: Assignee;
}


export async function getBoards(): Promise<Board[]> {
   // Получаем объект с полем data, содержащим массив объектов типа Board
   const response = await apiRequest<{ data: Board[] }>('get', '/boards');
   return response.data;
}



export async function getBoardTasks(boardId: number): Promise<Task[]> {
   const response = await apiRequest<{data: Task[]}>('get', `/boards/${boardId}`);
   return response.data;
}
