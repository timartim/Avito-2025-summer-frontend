// apiTasks.ts
import { apiRequest } from './apiRequest';
import { Task } from './boardRequests.ts';
import { CreateTaskInput, UpdateTaskInput } from '../../Interfaces/appInterfaces.ts';



export interface UpdateTaskStatusInput {
   status: 'Не начато' | 'В процессе' | 'Выполнено' | string;
}


export async function getTasks(): Promise<Task[]> {
   const response = await apiRequest<{ data: Task[] }>('get', '/tasks');
   return response.data;
}


export async function getTask(taskId: number): Promise<Task> {
   const response = await apiRequest<{ data: Task }>('get', `/tasks/${taskId}`);
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
