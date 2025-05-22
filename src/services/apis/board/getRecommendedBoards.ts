import { SERVER_URL } from '@/services/config/constants';
import { GetRecommendedBoardsResponse } from './dto';

export const getRecommendedBoards = async (): Promise<GetRecommendedBoardsResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/board/home`);

	if (!response.ok) {
		let errorPayload: unknown;
		try {
			errorPayload = await response.json();
		} catch (error) {
			errorPayload = error; // response가 json이 아닌 경우 방어
		}
		console.error('추천 게시글 조회 실패:', errorPayload);
		return null;
	}
	return response.json();
};
