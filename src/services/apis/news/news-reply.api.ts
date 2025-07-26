import { SERVER_URL } from '@/services/config/constants';
import { EmptySuccessResponse, SuccessResponse } from '@/services/config/dto';
import { fetcher } from '@/lib/server/fetcher';
import { createNewsReplyRequest, GetNewsCommentsResponse, PostNewsCommentKickRequest } from './news-reply.type';
import { CommonPatchReply } from '../common/types';

// 뉴스 댓글 목록 조회
export const getNewsCommentList = async (
	id: number,
	page: number = 1,
	size: number = 10,
): Promise<GetNewsCommentsResponse | null> => {
	const params = new URLSearchParams({
		news: String(id),
		page: String(page),
		size: String(size),
	});

	const response = await fetch(`${SERVER_URL}/api/news-reply?${params.toString()}`);

	if (!response.ok) {
		try {
			const errorText = await response.text();
			console.error('뉴스 댓글 조회 실패 - 응답 상태:', response.status, response.statusText);
			console.error('서버 응답 본문:', errorText);
			throw new Error('뉴스 댓글 조회 실패');
		} catch (error) {
			console.error(error); // text로 파싱이 불가능한 경우 방어
		}
	}

	return response.json();
};

// 뉴스 댓글 킥
export const postNewsCommentKick = async (id: number): Promise<SuccessResponse<null>> => {
	try {
		const body: PostNewsCommentKickRequest = { reply: id };
		const response = await fetcher<SuccessResponse<null>>({ method: 'POST', url: '/api/news-reply-kick', body });

		return response;
	} catch (error) {
		console.error('뉴스 댓글 킥 생성 실패:', error);
		throw error;
	}
};

// 뉴스 댓글 생성
export const postCreateReply = async (requestBody: createNewsReplyRequest): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({ method: 'POST', url: '/api/news-reply', body: requestBody });

		return response;
	} catch (error) {
		console.error('뉴스 댓글 작성 실패:', error);
		throw error;
	}
};

// 뉴스 댓글 삭제
export const deleteNewsReply = async (commentPk: number): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({ method: 'DELETE', url: `/api/news-reply/${commentPk}` });

		return response;
	} catch (error) {
		console.error('뉴스 댓글 삭제 실패:', error);
		throw error;
	}
};

// 뉴스 댓글 수정
export const patchReply = async (commentPk: number, requestBody: CommonPatchReply): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({
			method: 'PATCH',
			url: `/api/news-reply/${commentPk}`,
			body: requestBody,
		});

		return response;
	} catch (error) {
		console.error('뉴스 댓글 수정 실패:', error);
		throw error;
	}
};
