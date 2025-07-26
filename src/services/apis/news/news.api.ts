import { fetcher } from '@/lib/server/fetcher';
import { GetDetailResponse } from './news.type';

// 뉴스 상세 조회
export const getNewsDetailContent = async (id: number): Promise<GetDetailResponse | null> => {
	try {
		const response = await fetcher<GetDetailResponse>({ method: 'GET', url: `/api/news/${id}` });

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
