import { SERVER_URL } from '@/services/config/constants';
import { createNewReplyRequest, GetCommentsResponse, PostCommentKickRequest } from './dto';
import { EmptySuccessResponse, SuccessResponse } from '@/services/config/dto';
import { getAccessToken } from '@/lib/utils/getAccessToken';

const JWT = getAccessToken();

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
		const errorText = await response.text();
		console.error('댓글 조회 실패 - 응답 상태:', response.status, response.statusText);
		console.error('서버 응답 본문:', errorText);
		throw new Error('댓글 조회 실패');
	}

	return response.json();
};

export const postCommentKick = async (id: number, isNews: boolean = false): Promise<SuccessResponse<null>> => {
	const endpoint = isNews ? 'news-reply-kick' : 'board-reply-kick';

	const body: PostCommentKickRequest = { reply: id };
	const response = await fetch(`${SERVER_URL}/api/${endpoint}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${JWT}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(`Failed to kick comment: ${response.statusText}`);
	}

	return response.json();
};

export const postCreateReply = async (
	type: 'news' | 'board',
	requestBody: createNewReplyRequest,
): Promise<EmptySuccessResponse> => {
	const endpoint = type === 'news' ? '/api/news-reply' : '/api/board-reply';

	const response = await fetch(`${SERVER_URL}${endpoint}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${JWT}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestBody),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('댓글 작성 실패 - 응답 상태:', response.status, response.statusText);
		console.error('응답 본문:', errorText);
		throw new Error('댓글 작성 실패');
	}

	return response.json(); // 성공하면 응답 데이터 반환
};
