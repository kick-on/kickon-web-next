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
		console.error('상세 페이지 조회 오류', await response.json());
		return null;
	}
	return response.json();
};
