import { MIMIZAE_JWT, SERVER_URL } from '@/services/config/constants';
import { GetDetailResponse } from './dto';

export const getDetailByType = async (type: 'news' | 'board', id: number): Promise<GetDetailResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/${type}/${id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${MIMIZAE_JWT}`,
		},
	});

	if (!response.ok) {
		console.error(`${type} 상세페이지 조회 오류`, await response.json());
		return null;
	}
	return response.json();
};
