import { fetcher } from '@/lib/server/fetcher';
import { FailResponse } from '@/services/config/dto';
import { GetMyPredictionsRequest, GetMyPredictionsResponse, GetMyStatsResponse } from './dto';

// 내가 참여한 예측 리스트 조회
export const getMyPredictions = async ({
	from,
	to,
}: GetMyPredictionsRequest): Promise<GetMyPredictionsResponse | null> => {
	const params = new URLSearchParams();

	params.append('from', from);
	params.append('to', to);

	const response = await fetcher<GetMyPredictionsResponse | FailResponse>({
		method: 'GET',
		url: `/api/game/my-predictions?${params.toString()}`,
	});

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error('참여한 예측 리스트 조회 실패:', response);
		return null;
	}
	return response;
};

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
