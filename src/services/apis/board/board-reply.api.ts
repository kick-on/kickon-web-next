import { SERVER_URL } from '@/services/config/constants';
import { EmptySuccessResponse, SuccessResponse } from '@/services/config/dto';
import { fetcher } from '@/lib/server/fetcher';
import { CreateBoardReplyRequest, CreateEditBoardReplyRespones, GetBoardCommentsResponse } from './board-reply.type';
import { CommonCommentKickDto, CommonPatchReplyDto, CommonPatchReplyRequest } from '../common/types';
import { GetCommentsRequest } from '../news/news.type';

// 게시글 댓글 목록 조회
export const getBoardCommentList = async ({
	id,
	page,
	size,
	infinite,
	lastReply,
}: GetCommentsRequest): Promise<GetBoardCommentsResponse | null> => {
	const params = new URLSearchParams({
		board: String(id),
		page: String(page),
		size: String(size),
	});
	if (infinite !== undefined) params.append('infinite', String(infinite));
	if (lastReply !== undefined) params.append('lastReply', String(lastReply));

	const response = await fetch(`${SERVER_URL}/api/board-reply?${params.toString()}`);

	if (!response.ok) {
		try {
			const errorText = await response.text();
			console.error('게시글 댓글 조회 실패 - 응답 상태:', response.status, response.statusText);
			console.error('서버 응답 본문:', errorText);
			throw new Error('게시글 댓글 조회 실패');
		} catch (error) {
			console.error(error); // text로 파싱이 불가능한 경우 방어
		}
	}

	return response.json();
};

// 댓글 킥
export const createBoardCommentKick = async (id: number): Promise<SuccessResponse<null>> => {
	try {
		const body: CommonCommentKickDto = { reply: id };
		const response = await fetcher<SuccessResponse<null>>({ method: 'POST', url: '/api/board-reply-kick', body });

		return response;
	} catch (error) {
		console.error('게시글 댓글 킥 생성 실패:', error);
		throw error;
	}
};

// 댓글 생성
export const createBoardReply = async (requestBody: CreateBoardReplyRequest): Promise<CreateEditBoardReplyRespones> => {
	try {
		const response = await fetcher<CreateEditBoardReplyRespones>({
			method: 'POST',
			url: '/api/board-reply',
			body: requestBody,
		});

		return response;
	} catch (error) {
		console.error('게시글 댓글 작성 실패:', error);
		throw error;
	}
};

// 댓글 삭제
export const deleteBoardReply = async (commentPk: number): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({ method: 'DELETE', url: `/api/board-reply/${commentPk}` });

		return response;
	} catch (error) {
		console.error('게시글 댓글 삭제 실패:', error);
		throw error;
	}
};

// 게시글 댓글 수정
export const patchBoardReply = async ({
	commentPk,
	requestBody,
}: CommonPatchReplyRequest): Promise<CreateEditBoardReplyRespones> => {
	try {
		const response = await fetcher<CreateEditBoardReplyRespones>({
			method: 'PATCH',
			url: `/api/board-reply/${commentPk}`,
			body: requestBody,
		});

		return response;
	} catch (error) {
		console.error('게시글 댓글 수정 실패:', error);
		throw error;
	}
};
