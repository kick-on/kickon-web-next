import { SuccessResponse } from '@/services/config/dto';

export type GetTeamResponse = SuccessResponse<TeamDto[]>;

export interface TeamDto {
	pk: number;
	nameKr: string;
	nameEn: string;
	logoUrl: string;
	priorityNum?: number;
	leaguePk?: number;
	leagueNameKr?: string;
	leagueNameEn?: string;
	leagueLogoUrl?: string;
}
