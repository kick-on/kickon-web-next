import axiosInstance from '@/services/config/axiosInstance';
import { PostReportDetailRequest } from './dto';
import { EmptySuccessResponse } from '@/services/config/dto';

export const postReportDetail = async (
	data: PostReportDetailRequest,
	isNews: boolean = false,
): Promise<EmptySuccessResponse> => {
	try {
		const endpoint = isNews ? '/api/report-news' : '/api/report-board';

		const response = await axiosInstance.post<EmptySuccessResponse>(endpoint, data);

		return response;
	} catch (error) {
		console.error('상세페이지 신고 실패:', error);
		throw error;
	}
};
