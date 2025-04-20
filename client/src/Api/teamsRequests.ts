// src/Api/teamsRequests.ts
import { apiRequest } from './apiRequest.ts';
import { Team, TeamDetail } from '../Interfaces/appInterfaces.ts';

/**
 * Получает список всех команд.
 *
 * @returns Промис, который разрешается массивом объектов Team.
 * @throws Ошибка сети или сервера при выполнении запроса.
 */
export async function getTeams(): Promise<Team[]> {
   // Выполняем GET-запрос к эндпоинту /teams
   return await apiRequest<Team[]>('get', '/teams');
}

/**
 * Загружает подробную информацию о конкретной команде по её идентификатору.
 *
 * @param teamId Идентификатор команды.
 * @returns Промис, который разрешается объектом TeamDetail.
 * @throws Ошибка сети или сервера при выполнении запроса.
 */
export async function getTeam(teamId: number): Promise<TeamDetail> {
   // Выполняем GET-запрос к эндпоинту /teams/:teamId
   return await apiRequest<TeamDetail>('get', `/teams/${teamId}`);
}
