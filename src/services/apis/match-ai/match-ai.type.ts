import { SuccessResponse } from '@/services/config/dto';

// ai 분석 조회
export type GetMatchAiAnalyticsResponse = SuccessResponse<MatchAiAnalyticsDto>;

export interface MatchAiAnalyticsDto {
	gamePk: number;
	summary: string;
	mvp: {
		playerName: string;
		oneLineReview: string;
	};
	worst: {
		playerName: string;
		oneLineReview: string;
	};
}
