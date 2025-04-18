// apiTeams.ts
import { apiRequest } from './apiRequest';
import { Team, TeamDetail } from '../../Interfaces/appInterfaces.ts';



export async function getTeams(): Promise<Team[]> {
   return await apiRequest<Team[]>('get', '/teams');
}

export async function getTeam(teamId: number): Promise<TeamDetail> {
   return await apiRequest<TeamDetail>('get', `/teams/${teamId}`);
}
