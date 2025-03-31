import axiosInstance from '@/services/config/axiosInstance';
import { GetUserPointRankingResponse } from './dto';
import { FailResponse } from '@/services/config/dto';

export const getUserPointRanking = async () => {
	try {
		const response = await axiosInstance.get<GetUserPointRankingResponse | FailResponse>(
			'/api/user-point-event/ranking',
		);

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('유저 포인트/랭킹 조회 실패: ', error);
	}
};
