import { SERVER_URL } from '@/services/config/constants';
import { GetRecommendedNewsRequest, GetRecommendedNewsResponse } from './dto';

export const getRecommendedNews = async ({
	type,
}: GetRecommendedNewsRequest): Promise<GetRecommendedNewsResponse | null> => {
	const params = new URLSearchParams();

	if (type !== undefined) params.append('type', type);
	const response = await fetch(`${SERVER_URL}/api/news/home?${params.toString()}`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
