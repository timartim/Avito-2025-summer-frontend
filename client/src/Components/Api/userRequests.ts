// apiUsers.ts
import { apiRequest } from './apiRequest';
import { UserFull, UserTask } from '../../Interfaces/appInterfaces.ts';




export async function getUsers(): Promise<UserFull[]> {

   const response = await apiRequest<{ data: UserFull[] }>('get', '/users');
   return response.data;
}


export async function getUserTasks(userId: number): Promise<UserTask[]> {
   const response = await apiRequest<{ data: UserTask[] }>('get', `/users/${userId}/tasks`);
   return response.data;
}
