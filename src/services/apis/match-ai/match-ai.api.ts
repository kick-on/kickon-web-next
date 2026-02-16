import { fetcher } from '@/lib/server/fetcher';
import { GetMatchAiAnalyticsResponse } from '@/services/apis/match-ai/match-ai.type';

// ai 분석 조회
export const getMatchAiAnalytics = async (gamePk: number) => {
	const response = await fetcher<GetMatchAiAnalyticsResponse>({
		method: 'GET',
		url: `/api/match-ai/${gamePk}`,
	});

	return response;
};
