import { SERVER_URL } from '@/services/config/constants';
import { createNewReplyRequest, GetCommentsResponse, patchReplyRequest, PostCommentKickRequest } from './dto';
import { EmptySuccessResponse, SuccessResponse } from '@/services/config/dto';
import { fetcher } from '@/lib/server/fetcher';

// 댓글 목록 조회
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
		try {
			const errorText = await response.text();
			console.error('댓글 조회 실패 - 응답 상태:', response.status, response.statusText);
			console.error('서버 응답 본문:', errorText);
			throw new Error('댓글 조회 실패');
		} catch (error) {
			console.error(error); // text로 파싱이 불가능한 경우 방어
		}
	}

	return response.json();
};

// 댓글 킥
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

// 댓글 생성
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

// 댓글 삭제
export const deleteReply = async (commentPk: number, type: 'news' | 'board'): Promise<EmptySuccessResponse> => {
	try {
		const endpoint = type === 'news' ? `/api/news-reply/${commentPk}` : `/api/board-reply/${commentPk}`;

		const response = await fetcher<EmptySuccessResponse>({ method: 'DELETE', url: endpoint });

		return response;
	} catch (error) {
		console.error('댓글 삭제 실패:', error);
		throw error;
	}
};

// 댓글 수정
export const patchReply = async (
	type: 'news' | 'board',
	commentPk: number,
	requestBody: patchReplyRequest,
): Promise<EmptySuccessResponse> => {
	try {
		const endpoint = type === 'news' ? `/api/news-reply/${commentPk}` : `/api/board-reply/${commentPk}`;

		const response = await fetcher<EmptySuccessResponse>({ method: 'PATCH', url: endpoint, body: requestBody });

		return response;
	} catch (error) {
		console.error('댓글 수정 실패:', error);
		throw error;
	}
};
