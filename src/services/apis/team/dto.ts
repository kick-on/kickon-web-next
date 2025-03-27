import { SuccessResponse } from '@/services/config/dto';

export type GetTeamResponse = SuccessResponse<TeamDto[]>;

export interface TeamDto {
	name: string;
	pk: number;
	logoUrl: string;
}
