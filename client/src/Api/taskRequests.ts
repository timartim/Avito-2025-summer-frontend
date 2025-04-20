// src/Api/taskRequests.ts
import { apiRequest } from './apiRequest.ts';
import { CreateTaskInput, UpdateTaskInput, Task } from '../Interfaces/appInterfaces.ts';

/**
 * Вспомогательный тип для передачи нового статуса задачи.
 */
export interface UpdateTaskStatusInput {
   status: 'Backloog' | 'InProcess' | 'Completed' | string;
}

/**
 * Запрашивает все задачи из API.
 *
 * @returns Промис, который разрешается массивом Task.
 * @throws Ошибка сети или сервера.
 */
export async function getTasks(): Promise<Task[]> {
   const response = await apiRequest<{ data: Task[] }>('get', '/tasks');
   return response.data;
}

/**
 * Загружает данные конкретной задачи по её идентификатору.
 *
 * @param taskId Идентификатор задачи.
 * @returns Промис, который разрешается объектом Task.
 * @throws Ошибка сети или сервера.
 */
export async function getTask(taskId: number): Promise<Task> {
   const response = await apiRequest<{ data: Task }>('get', `/tasks/${taskId}`);
   return response.data;
}

/**
 * Создаёт новую задачу на сервере.
 *
 * @param input Объект с полями title, description, priority, assigneeId, boardId, boardName.
 * @returns Промис, который разрешается объектом с полем id созданной задачи.
 * @throws Ошибка сети или сервера.
 */
export async function createTask(input: CreateTaskInput): Promise<{ id: number }> {
   const response = await apiRequest<{ data: { id: number } }>('post', '/tasks/create', input);
   return response.data;
}

/**
 * Полностью обновляет существующую задачу.
 *
 * @param taskId Идентификатор задачи для обновления.
 * @param input Объект с новыми данными задачи.
 * @returns Промис, который разрешается объектом с полем message от сервера.
 * @throws Ошибка сети или сервера.
 */
export async function updateTask(
   taskId: number,
   input: UpdateTaskInput
): Promise<{ message: string }> {
   return apiRequest<{ message: string }>('put', `/tasks/update/${taskId}`, input);
}

/**
 * Обновляет только статус задачи.
 *
 * @param taskId Идентификатор задачи.
 * @param input Объект с новым статусом.
 * @returns Промис, который разрешается объектом с полем message от сервера.
 * @throws Ошибка сети или сервера.
 */
export async function updateTaskStatus(
   taskId: number,
   input: UpdateTaskStatusInput
): Promise<{ message: string }> {
   return apiRequest<{ message: string }>('put', `/tasks/updateStatus/${taskId}`, input);
}
