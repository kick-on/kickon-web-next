import { fetcher } from '@/lib/server/fetcher';
import { EmptySuccessResponse } from '@/services/config/dto';

// 게시글 조회 수 요청 api
export const createBoardView = async (boardId: number): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({
			method: 'POST',
			url: '/api/board-view-history',
			body: { board: boardId },
		});

		return response;
	} catch (error) {
		console.error('뷰 생성 실패:', error);
		throw error;
	}
};
