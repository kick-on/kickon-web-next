import { PatchContentsRequest } from './dto';
import { EmptySuccessResponse } from '@/services/config/dto';
import { fetcher } from '@/lib/server/fetcher';

// 상세페이지 수정

export const patchDetailContent = async (
	contentPk: number,
	isNews: boolean = false,
	requestBody: PatchContentsRequest,
): Promise<EmptySuccessResponse> => {
	try {
		const endpoint = isNews ? `/api/news/${contentPk}` : `/api/board/${contentPk}`;

		const response = await fetcher<EmptySuccessResponse>({ method: 'PATCH', url: endpoint, body: requestBody });

		return response;
	} catch (error) {
		console.error('상세페이지 수정 실패:', error);
		throw error;
	}
};

// 상세페이지 삭제
export const deleteDetailContent = async (
	contentPk: number,
	isNews: boolean = false,
): Promise<EmptySuccessResponse> => {
	try {
		const endpoint = isNews ? `/api/news/${contentPk}` : `/api/board/${contentPk}`;

		const response = await fetcher<EmptySuccessResponse>({ method: 'DELETE', url: endpoint });

		return response;
	} catch (error) {
		console.error('상세페이지 삭제 실패:', error);
		throw error;
	}
};
