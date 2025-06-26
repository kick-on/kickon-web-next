import { SuccessResponse } from '@/services/config/dto';

export type GetTeamResponse = SuccessResponse<TeamDto[]>;

export interface TeamDto {
	nameKr: string;
	nameEn: string;
	pk: number;
	logoUrl: string;
	priorityNum?: number;
}
