import { MIMIZAE_JWT, SERVER_URL } from '@/services/config/constants';
import { GetCommentsResponse, PostCommentKickRequest } from './dto';
import { SuccessResponse } from '@/services/config/dto';

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

export const postCommentKick = async (id: number, isNews: boolean = false): Promise<SuccessResponse<null>> => {
	const endpoint = isNews ? 'news-reply-kick' : 'board-reply-kick';

	const body: PostCommentKickRequest = { reply: id };

	const response = await fetch(`${SERVER_URL}/api/${endpoint}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${MIMIZAE_JWT}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(`Failed to kick comment: ${response.statusText}`);
	}

	return response.json();
};
