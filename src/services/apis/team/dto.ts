import { SuccessResponse } from '@/services/config/dto';

export type GetTeamResponse = SuccessResponse<TeamDto[]>;

export interface TeamDto {
	krName: string;
	enName: string;
	pk: number;
	logoUrl: string;
}
