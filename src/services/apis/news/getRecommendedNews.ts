import axiosInstance from '@/services/config/axiosInstance';
import { GetRecommendedNewsRequest, GetRecommendedNewsResponse } from './dto';

export const getRecommendedNews = async ({
	type,
}: GetRecommendedNewsRequest): Promise<GetRecommendedNewsResponse | null> => {
	try {
		const response = await axiosInstance.get<GetRecommendedNewsResponse>('/api/news/home', {
			params: type ? { type } : {},
		});
		return response;
	} catch (error) {
		console.error('추천 뉴스 조회 실패:', error);
		return null;
	}
};
