import { appendParams } from '@/lib/server/appendParams';
import { fetcher } from '@/lib/server/fetcher';
import {
	CreateGameCommentRequest,
	CreateGameCommentResponse,
	GetGameCommentListRequest,
	GetGameCommentListResponse,
	GetTopGameCommentResponse,
} from '@/services/apis/game/game-reply.type';
import { SuccessResponse } from '@/services/config/dto';
import { CommonCommentKickDto } from '@/services/apis/common/types';

// 경기 별 댓글 리스트 조회
export const getGameCommentList = async (req: GetGameCommentListRequest) => {
	const params = new URLSearchParams();
	appendParams(params, req);

	const response = await fetcher<GetGameCommentListResponse>({
		method: 'GET',
		url: `/api/game-reply?${params.toString()}`,
	});

	return response;
};

// 경기 별 인기 댓글 조회
export const getTopGameComment = async (gamePk: number) => {
	const response = await fetcher<GetTopGameCommentResponse>({
		method: 'GET',
		url: `/api/game-reply/top?game=${gamePk}`,
	});

	return response;
};

// 경기 별 댓글 생성
export const createGameComment = async (body: CreateGameCommentRequest) => {
	const response = await fetcher<CreateGameCommentResponse>({
		method: 'POST',
		url: '/api/game-reply',
		body: body,
	});

	return response;
};

// 경기 별 댓글 킥
export const toggleGameCommentKick = async (commentPk: number) => {
	const body: CommonCommentKickDto = { reply: commentPk };
	const response = await fetcher<SuccessResponse<null>>({ method: 'POST', url: '/api/game-reply-kick', body });

	return response;
};
