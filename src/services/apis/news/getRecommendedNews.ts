import { SERVER_URL } from '@/services/config/constants';
import { GetRecommendedNewsRequest, GetRecommendedNewsResponse } from './dto';
import { getAuthToken } from '@/lib/utils/getAccessToken';

export const getRecommendedNews = async ({
	type,
}: GetRecommendedNewsRequest): Promise<GetRecommendedNewsResponse | null> => {
	const params = new URLSearchParams();
	const JWT = getAuthToken();

	// 헤더 동적 설정
	const headers: HeadersInit = JWT ? { Authorization: `Bearer ${JWT}` } : {};

	if (type !== undefined) params.append('type', type);
	const response = await fetch(`${SERVER_URL}/api/news/home?${params.toString()}`, {
		method: 'GET',
		headers,
	});

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
