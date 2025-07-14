import { SuccessResponse } from '@/services/config/dto';
import { GameTaggedLeagueDto } from '../user-game-gamble/dto';

// 참여한 예측 리스트 조회
export interface GetMyPredictionsRequest {
	from: string; // YYYY-MM-DD
	to: string; // YYYY-MM-DD
}

export type GetMyPredictionsResponse = SuccessResponse<MyPredictionsDto>;

export type MyPredictionsDto = GameTaggedLeagueDto;

// 예측 통계 조회
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
