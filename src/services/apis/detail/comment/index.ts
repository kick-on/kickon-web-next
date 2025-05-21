import { SERVER_URL } from '@/services/config/constants';
import { createNewReplyRequest, GetCommentsResponse, PostCommentKickRequest } from './dto';
import { EmptySuccessResponse, SuccessResponse } from '@/services/config/dto';
import { fetcher } from '@/lib/server/fetcher';

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
	try {
		const endpoint = isNews ? 'news-reply-kick' : 'board-reply-kick';

		const body: PostCommentKickRequest = { reply: id };
		const response = await fetcher<SuccessResponse<null>>({ method: 'POST', url: `/api/${endpoint}`, body });

		return response;
	} catch (error) {
		console.error('댓글 킥 생성 실패:', error);
		throw error;
	}
};

export const postCreateReply = async (
	type: 'news' | 'board',
	requestBody: createNewReplyRequest,
): Promise<EmptySuccessResponse> => {
	try {
		const endpoint = type === 'news' ? '/api/news-reply' : '/api/board-reply';

		const response = await fetcher<EmptySuccessResponse>({ method: 'POST', url: endpoint, body: requestBody });

		return response;
	} catch (error) {
		console.error('댓글 작성 실패:', error);
		throw error;
	}
};
