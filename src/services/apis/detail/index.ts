import { SERVER_URL } from '@/services/config/constants';
import { GetNewsDetailResponse } from './dto';

const JWT = process.env.NEXT_PUBLIC_ACCESS_JWT;

export const getNewsDetail = async (newsPk: number): Promise<GetNewsDetailResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/news/${newsPk}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${JWT}`,
		},
	});

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
