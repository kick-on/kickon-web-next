import { fetcher } from '@/lib/server/fetcher';
import { FailResponse } from '@/services/config/dto';
import { GetMyStatsResponse } from './dto';

// 예측 통계 조회
export const getMyStats = async (): Promise<GetMyStatsResponse | null> => {
	const response = await fetcher<GetMyStatsResponse | FailResponse>({
		method: 'GET',
		url: '/api/game/my-stats',
	});

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error('예측 통계 조회 실패:', response);
		return null;
	}
	return response;
};
