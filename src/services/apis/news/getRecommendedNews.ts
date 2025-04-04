import { SERVER_URL } from '@/services/config/constants';
import { GetRecommendedNewsRequest, GetRecommendedNewsResponse } from './dto';
import axiosInstance from '@/services/config/axiosInstance';

export const getRecommendedNews = async ({ type }: GetRecommendedNewsRequest) => {
	const params = new URLSearchParams();

	if (type !== undefined) params.append('type', type);

	const response = await axiosInstance.get<GetRecommendedNewsResponse | null>(
		`${SERVER_URL}/api/news/home?${params.toString()}`,
	);

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error(response);
		return null;
	}
	return response;
};
