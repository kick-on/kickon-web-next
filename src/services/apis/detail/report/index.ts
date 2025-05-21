import { PostReportDetailRequest } from './dto';
import { EmptySuccessResponse } from '@/services/config/dto';
import { fetcher } from '@/lib/server/fetcher';

export const postReportDetail = async (
	data: PostReportDetailRequest,
	isNews: boolean = false,
): Promise<EmptySuccessResponse> => {
	try {
		const endpoint = isNews ? '/api/report-news' : '/api/report-board';

		const response = await fetcher<EmptySuccessResponse>({ method: 'POST', url: endpoint, body: data });

		return response;
	} catch (error) {
		console.error('상세페이지 신고 실패:', error);
		throw error;
	}
};
