import { getMatchAiAnalytics } from '@/services/apis/match-ai/match-ai.api';
import { useQuery } from '@tanstack/react-query';

export const matchAiKeys = {
	all: ['match-ai'] as const,
	analytics: (gamePk: number) => [...matchAiKeys.all, 'analytics', gamePk] as const,
};

// AI 분석 데이터 조회 훅
export const useMatchAiAnalyticsQuery = (gamePk: number, enabled = true) => {
	return useQuery({
		queryKey: matchAiKeys.analytics(gamePk),
		queryFn: () => getMatchAiAnalytics(gamePk),
		enabled: enabled && Number.isSafeInteger(gamePk) && gamePk > 0,
		staleTime: (query) => {
			// 응답이 있으면 24시간 캐싱
			return query.state.data?.data ? 1000 * 60 * 60 * 24 : 0;
		},
	});
};
