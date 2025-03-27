import { SERVER_URL } from '@/services/config/constants';
import { GetCommentsResponse } from './dto';

export const getCommentList = async (
	id: number,
	page: number = 1,
	size: number = 10,
	isNews: boolean = false,
): Promise<GetCommentsResponse | null> => {
	const params = new URLSearchParams({
		[isNews ? 'news' : 'board']: String(id),
		page: String(page),
		size: String(size),
	});

	const endpoint = isNews ? 'news-reply' : 'board-reply';
	const response = await fetch(`${SERVER_URL}/api/${endpoint}?${params.toString()}`);

	if (!response.ok) {
		console.error(`${endpoint} 댓글 리스트 조회 실패:`, await response.json());
		return null;
	}

	return response.json();
};
