import { GetRecommendedNewsRequest, GetRecommendedNewsResponse } from './dto';
import { fetcher } from '@/lib/server/fetcher';

export const getRecommendedNews = async ({ type }: GetRecommendedNewsRequest) => {
	const params = new URLSearchParams();

	if (type !== undefined) params.append('type', type);

	const response = await fetcher<GetRecommendedNewsResponse | null>({
		method: 'GET',
		url: `/api/news/home?${params.toString()}`,
	});

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error(response);
		return null;
	}
	return response;
};
