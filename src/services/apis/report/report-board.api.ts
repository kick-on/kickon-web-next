import { fetcher } from '@/lib/server/fetcher';
import { EmptySuccessResponse } from '@/services/config/dto';
import { PostReportBoardRequest } from './report-board.type';

// 게시글 상세페이지 신고
export const postReportBoard = async (data: PostReportBoardRequest): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({ method: 'POST', url: '/api/report-board', body: data });

		return response;
	} catch (error) {
		console.error('게시글 상세페이지 신고 실패:', error);
		throw error;
	}
};
