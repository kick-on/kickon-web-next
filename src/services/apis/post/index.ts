import axiosInstance from '@/services/config/axiosInstance';
import { PostNewsContentsRequest } from './dto';

export async function postNewContents(data: PostNewsContentsRequest, isNews: boolean = false) {
	try {
		const endpoint = isNews ? '/api/news' : '/api/board';

		console.log(data);

		const response = await axiosInstance.post(endpoint, data);

		return response;
	} catch (error) {
		console.error('API 요청 실패:', error);
		throw error;
	}
}
