// apiTeams.ts
import { apiRequest } from './apiRequest';

export interface Team {
   id: number;
   name: string;
   description: string;
   boardsCount: number;
   usersCount: number;
}

export interface Board {
   id: number;
   name: string;
   description: string;
}

export interface User {
   id: number;
   fullName: string;
   email: string;
   avatarUrl: string;
   description?: string;
}

export interface TeamDetail {
   id: number;
   name: string;
   description: string;
   boards: Board[];
   users: User[];
}


export async function getTeams(): Promise<Team[]> {
   return await apiRequest<Team[]>('get', '/teams');
}

export async function getTeam(teamId: number): Promise<TeamDetail> {
   return await apiRequest<TeamDetail>('get', `/teams/${teamId}`);
}
