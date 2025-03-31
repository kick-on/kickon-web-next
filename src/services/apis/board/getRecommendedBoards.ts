import { SERVER_URL } from '@/services/config/constants';
import { GetRecommendedBoardsResponse } from './dto';

export const getRecommendedBoards = async (): Promise<GetRecommendedBoardsResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/board/home`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
