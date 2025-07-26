import { fetcher } from '@/lib/server/fetcher';
import { EmptySuccessResponse } from '@/services/config/dto';
import { PostNewsViewRequest } from './news-view-history.type';

interface PostNewsViewProps {
	requestBody: PostNewsViewRequest;
}

// 뉴스 조회 수 요청 api
export const PostNewsView = async ({ requestBody }: PostNewsViewProps): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({
			method: 'POST',
			url: '/api/news-view-history',
			body: requestBody,
		});

		return response;
	} catch (error) {
		console.error('뷰 생성 실패:', error);
		throw error;
	}
};
