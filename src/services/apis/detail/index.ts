import { SERVER_URL } from '@/services/config/constants';
import { GetDetailResponse } from './dto';

const JWT = process.env.NEXT_PUBLIC_ACCESS_JWT; // 로그인 엮기 전 임시

export const getDetailByType = async (type: 'news' | 'board', id: number): Promise<GetDetailResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/${type}/${id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${JWT}`,
		},
	});

	if (!response.ok) {
		console.error(`${type} 상세페이지 조회 오류`, await response.json());
		return null;
	}
	return response.json();
};
