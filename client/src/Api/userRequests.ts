// src/Api/userRequests.ts
import { apiRequest } from './apiRequest.ts';
import { UserFull, UserTask } from '../Interfaces/appInterfaces.ts';

/**
 * Запрашивает список всех пользователей.
 *
 * @returns Промис, разрешающийся массивом объектов UserFull.
 * @throws Ошибка сети или сервера при выполнении запроса.
 */
export async function getUsers(): Promise<UserFull[]> {
   // Выполняем GET-запрос по пути /users
   const response = await apiRequest<{ data: UserFull[] }>('get', '/users');
   return response.data;
}

/**
 * Загружает все задачи, назначенные конкретному пользователю.
 *
 * @param userId Идентификатор пользователя.
 * @returns Промис, разрешающийся массивом объектов UserTask.
 * @throws Ошибка сети или сервера при выполнении запроса.
 */
export async function getUserTasks(userId: number): Promise<UserTask[]> {
   // Выполняем GET-запрос по пути /users/:userId/tasks
   const response = await apiRequest<{ data: UserTask[] }>(
      'get',
      `/users/${userId}/tasks`
   );
   return response.data;
}
