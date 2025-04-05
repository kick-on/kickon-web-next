import axiosInstance from '@/services/config/axiosInstance';
import { EmptySuccessResponse } from '@/services/config/dto';

export const postContentLike = async (id: number, isNews: boolean = false): Promise<EmptySuccessResponse> => {
	try {
		const body = { [isNews ? 'news' : 'board']: id };
		const endpoint = isNews ? '/api/news-kick' : '/api/board-kick';

		console.log(body);

		const response = await axiosInstance.post<EmptySuccessResponse>(endpoint, body);

		return response;
	} catch (error) {
		console.error('상세페이지 킥 생성 실패:', error);
		throw error;
	}
};
