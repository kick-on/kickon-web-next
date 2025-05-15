import { GetDetailResponse } from './dto';
import { fetcher } from '@/lib/server/fetcher';

export const getDetailContent = async (type: 'news' | 'board', id: number): Promise<GetDetailResponse | null> => {
	try {
		const response = await fetcher<GetDetailResponse>({ method: 'GET', url: `/api/${type}/${id}` });

		if (!response) {
			console.error('상세페이지 조회 실패 - 응답 없음');
			throw new Error('상세페이지 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('상세페이지 조회 실패:', error);
		throw error;
	}
};
