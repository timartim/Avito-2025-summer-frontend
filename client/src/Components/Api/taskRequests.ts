// apiTasks.ts
import { apiRequest } from './apiRequest';


export interface Assignee {
   id: number;
   fullName: string;
   email: string;
   avatarUrl: string;
}


export interface TaskFull {
   id: number;
   title: string;
   description: string;
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | string;
   status: 'Не начато' | 'В процессе' | 'Выполнено' | string;
   assignee: Assignee;
   assigneeId: number;
   boardId: number;
   boardName: string;
}


export interface CreateTaskInput {
   assigneeId: number;
   boardId: number;
   description: string;
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | string;
   title: string;
}


export interface UpdateTaskInput {
   assigneeId: number;
   description: string;
   priority: 'Небольшое' | 'Среднее' | 'Высокое' | string;
   status: 'Не начато' | 'В процессе' | 'Выполнено' | string;
   title: string;
}


export interface UpdateTaskStatusInput {
   status: 'Не начато' | 'В процессе' | 'Выполнено' | string;
}


export async function getTasks(): Promise<TaskFull[]> {
   const response = await apiRequest<{ data: TaskFull[] }>('get', '/tasks');
   return response.data;
}


export async function getTask(taskId: number): Promise<TaskFull> {
   const response = await apiRequest<{ data: TaskFull }>('get', `/tasks/${taskId}`);
   return response.data;
}


export async function createTask(input: CreateTaskInput): Promise<{ id: number }> {
   const response = await apiRequest<{ data: {id: number} }>('post', '/tasks/create', input);
   return response.data;
}


export async function updateTask(taskId: number, input: UpdateTaskInput): Promise<{ message: string }> {
   return await apiRequest<{ message: string }>('put', `/tasks/update/${taskId}`, input);
}

export async function updateTaskStatus(taskId: number, input: UpdateTaskStatusInput): Promise<{ message: string }> {
   return await apiRequest<{ message: string }>('put', `/tasks/updateStatus/${taskId}`, input);
}
