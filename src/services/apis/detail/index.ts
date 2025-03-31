import { JWT, SERVER_URL } from '@/services/config/constants';
import { GetDetailResponse } from './dto';

export const getDetailContent = async (type: 'news' | 'board', id: number): Promise<GetDetailResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/${type}/${id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${JWT}`,
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('상세페이지 조회 실패 - 응답 상태:', response.status, response.statusText);
		console.error('서버 응답 본문:', errorText);
		throw new Error('상세페이지 조회 실패');
	}
	return response.json();
};
