// src/Api/boardRequests.ts
import { apiRequest } from './apiRequest.ts';
import {Board, Task } from '../Interfaces/appInterfaces.ts';

/**
 * Запрашивает список всех досок.
 *
 * Использует универсальную функцию apiRequest для выполнения GET-запроса.
 *
 * @returns Промис с массивом объектов Board.
 * @throws Ошибка сети или ответа сервера.
 */
export async function getBoards(): Promise<Board[]> {
   // Получаем объект с полем data, содержащим массив объектов типа Board
   const response = await apiRequest<{ data: Board[] }>('get', '/boards');
   return response.data;
}

/**
 * Загружает задачи для конкретной доски.
 *
 * Выполняет GET-запрос по эндпоинту /boards/{boardId}.
 *
 * @param boardId Идентификатор доски, для которой требуются задачи.
 * @returns Промис с массивом объектов Task.
 * @throws Ошибка сети или ответа сервера.
 */
export async function getBoardTasks(boardId: number): Promise<Task[]> {
   // Получаем объект с полем data, содержащим массив задач
   const response = await apiRequest<{ data: Task[] }>('get', `/boards/${boardId}`);
   return response.data;
}
