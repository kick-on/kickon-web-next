import { GetUserPointRankingResponse } from './dto';
import { FailResponse } from '@/services/config/dto';
import { fetcher } from '@/lib/server/fetcher';

export const getUserPointRanking = async () => {
	try {
		const response = await fetcher<GetUserPointRankingResponse | FailResponse>({
			method: 'GET',
			url: '/api/user-point-event/ranking',
		});

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('유저 포인트/랭킹 조회 실패: ', error);
	}
};
