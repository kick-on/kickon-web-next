import { SuccessResponse } from '@/services/config/dto';

export type GetLeagueResponse = SuccessResponse<LeagueDto[]>;

export interface LeagueDto {
	nameKr: string;
	nameEn: string;
	pk: number;
	logoUrl: string;
	leagueType: 'League' | 'Cup';
}
