import axiosInstance from '@/services/config/axiosInstance';
import { GetDetailResponse } from './dto';

export const getDetailContent = async (type: 'news' | 'board', id: number): Promise<GetDetailResponse | null> => {
	try {
		const response = await axiosInstance.get<GetDetailResponse>(`/api/${type}/${id}`);

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
