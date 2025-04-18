// apiRequests.ts
import { apiRequest } from './apiRequest';
import { Assignee, Board, Priority, Status, Task } from '../../Interfaces/appInterfaces.ts';






export async function getBoards(): Promise<Board[]> {
   // Получаем объект с полем data, содержащим массив объектов типа Board
   const response = await apiRequest<{ data: Board[] }>('get', '/boards');
   return response.data;
}



export async function getBoardTasks(boardId: number): Promise<Task[]> {
   const response = await apiRequest<{data: Task[]}>('get', `/boards/${boardId}`);
   console.log(response)
   return response.data;
}
