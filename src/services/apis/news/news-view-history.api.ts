import { fetcher } from '@/lib/server/fetcher';
import { EmptySuccessResponse } from '@/services/config/dto';

// 뉴스 조회 수 요청 api
export const createNewsView = async (newsId: number): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({
			method: 'POST',
			url: '/api/news-view-history',
			body: { news: newsId },
		});

		return response;
	} catch (error) {
		console.error('뷰 생성 실패:', error);
		throw error;
	}
};
