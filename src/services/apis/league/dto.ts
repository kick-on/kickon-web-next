import { SuccessResponse } from '@/services/config/dto';

export type GetLeagueResponse = SuccessResponse<LeagueDto[]>;

export interface LeagueDto {
	name: string;
	pk: number;
	logoUrl: string;
}
