import { SuccessResponse } from '@/services/config/dto';

export type GetLeagueResponse = SuccessResponse<LeagueDto[]>;

export interface LeagueDto {
	krName: string;
	enName: string;
	pk: number;
	logoUrl: string;
	leagueType: 'League' | 'Cup';
}
