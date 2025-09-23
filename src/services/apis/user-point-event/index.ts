import { GetUserPointRankingResponse } from './dto';
import { FailResponse } from '@/services/config/dto';
import { fetcher } from '@/lib/server/fetcher';

export const getUserPointRanking = async () => {
	const response = await fetcher<GetUserPointRankingResponse | FailResponse>({
		method: 'GET',
		url: '/api/user-point-event/ranking',
	});

	return response;
};
