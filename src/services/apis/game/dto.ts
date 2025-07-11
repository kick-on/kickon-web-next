import { SuccessResponse } from '@/services/config/dto';

export type GetMyStatsResponse = SuccessResponse<MyStatsDto>;

export interface MyStatsDto {
	totalSuccessRate: number;
	totalParticipationCount: number;
	participationRate: number;
	thisMonthSuccessRate: number;
	thisMonthHitSummary: string;
	thisMonthPoints: number;
	totalPoints: number;
	mostHitTeamName: string;
}
