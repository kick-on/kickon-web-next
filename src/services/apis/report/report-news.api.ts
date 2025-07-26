import { fetcher } from '@/lib/server/fetcher';
import { EmptySuccessResponse } from '@/services/config/dto';
import { PostReportNewsRequest } from './report-news.type';

// 상세페이지 신고
export const postReportNews = async (data: PostReportNewsRequest): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({ method: 'POST', url: '/api/report-news', body: data });

		return response;
	} catch (error) {
		console.error('뉴스 상세페이지 신고 실패:', error);
		throw error;
	}
};
