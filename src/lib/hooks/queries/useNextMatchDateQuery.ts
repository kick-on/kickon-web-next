import { getNextMatchDate } from '@/services/apis/calendar';
import { useQuery } from '@tanstack/react-query';

export const matchKeys = {
	all: ['match'] as const,
	nextDate: (today: string) => [...matchKeys.all, 'next-date', today] as const,
};

// 가장 가까운 예정 경기일 데이터를 전역 캐시로 관리하는 훅
export const useNextMatchDateQuery = (enabled = true) => {
	const todayStr = new Date().toISOString().split('T')[0];

	return useQuery({
		queryKey: matchKeys.nextDate(todayStr),
		queryFn: async () => {
			const response = await getNextMatchDate(todayStr);
			return response.data.nextDate;
		},
		enabled,
		staleTime: 1000 * 60 * 60 * 24,
		retry: 1,
	});
};
