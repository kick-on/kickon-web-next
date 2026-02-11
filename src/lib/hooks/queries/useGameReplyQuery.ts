import {
	createGameComment,
	getGameCommentList,
	getTopGameComment,
	toggleGameCommentKick,
} from '@/services/apis/game/game-reply.api';
import {
	CreateGameCommentRequest,
	CreateGameCommentResponse,
	GetGameCommentListRequest,
	GetGameCommentListResponse,
	GetTopGameCommentResponse,
} from '@/services/apis/game/game-reply.type';
import { SuccessResponse } from '@/services/config/dto';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const gameCommentKeys = {
	all: ['game-comment'] as const,
	list: (params: GetGameCommentListRequest) => [...gameCommentKeys.all, 'list', params] as const,
	top: (gamePk: number) => [...gameCommentKeys.all, 'top', gamePk] as const,
};

// 경기 댓글 무한 스크롤 조회
export const useGameCommentListInfiniteQuery = (params: GetGameCommentListRequest, enabled = true) => {
	return useInfiniteQuery<GetGameCommentListResponse, Error, GetGameCommentListResponse, any, number | undefined>({
		queryKey: gameCommentKeys.list({ ...params, infinite: true }),
		queryFn: ({ pageParam }) => getGameCommentList({ ...params, infinite: true, lastReply: pageParam }),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => {
			if (!lastPage.meta.hasNext) return undefined;
			return lastPage.data.at(-1)?.pk ?? undefined;
		},
		enabled: enabled && Number.isSafeInteger(params.game) && params.game > 0,
	});
};

// 경기 인기 댓글 조회
export const useTopGameCommentQuery = (gamePk: number, enabled = true) => {
	return useQuery<GetTopGameCommentResponse>({
		queryKey: gameCommentKeys.top(gamePk),
		queryFn: () => getTopGameComment(gamePk),
		enabled: enabled && Number.isSafeInteger(gamePk) && gamePk > 0,
	});
};

// 경기 댓글 생성
export const useCreateGameCommentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<CreateGameCommentResponse, unknown, CreateGameCommentRequest>({
		mutationFn: createGameComment,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: gameCommentKeys.all }),
	});
};

// 경기 댓글 킥
export const useToggleGameCommentKickMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<SuccessResponse<null>, unknown, number>({
		mutationFn: toggleGameCommentKick,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: gameCommentKeys.all }),
	});
};
