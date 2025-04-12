import { EmptySuccessResponse } from '@/services/config/dto';
import { PostContentViewRequest } from './dto';
import axiosInstance from '@/services/config/axiosInstance';

interface PostContentViewProps {
	requestBody: PostContentViewRequest;
	isNews?: boolean;
}

export const PostContentView = async ({
	requestBody,
	isNews = false,
}: PostContentViewProps): Promise<EmptySuccessResponse> => {
	try {
		const endpoint = isNews ? '/api/news-view-history' : '/api/board-view-history';

		const response = await axiosInstance.post<EmptySuccessResponse>(endpoint, requestBody);

		return response;
	} catch (error) {
		console.error('뷰 생성 실패:', error);
		throw error;
	}
};
