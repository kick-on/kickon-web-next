import { createBoardReply, getBoardCommentList, patchBoardReply } from '@/services/apis/board/board-reply.api';
import { CreateBoardReplyRequest, CreateEditBoardReplyRespones } from '@/services/apis/board/board-reply.type';
import { getBoardDetail } from '@/services/apis/board/board.api';
import { PatchBoardDetailRequest } from '@/services/apis/board/board.type';
import { CommonPatchReplyRequest } from '@/services/apis/common/types';
import { createNewsReply, getNewsCommentList, patchNewsReply } from '@/services/apis/news/news-reply.api';
import {
	CreateEditNewsReplyRespones,
	CreateNewsReplyRequest,
	GetNewsCommentsResponse,
} from '@/services/apis/news/news-reply.type';
import { getNewsDetail } from '@/services/apis/news/news.api';
import { GetCommentsRequest, PatchNewsDetailRequest } from '@/services/apis/news/news.type';
import { SuccessResponse } from '@/services/config/dto';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type PostType = 'news' | 'board';

export const commentKeys = {
	all: ['comment'] as const,
	list: (type: PostType, params: GetCommentsRequest) => [...commentKeys.all, 'list', type, params] as const,
	commentCount: (type: PostType, postId: number) => [...commentKeys.all, 'commentCount', type, postId] as const,
};

// 데스크톱 댓글 리스트 조회
export const useCommentListQuery = (type: PostType, params: GetCommentsRequest, enabled: boolean) => {
	return useQuery({
		queryKey: commentKeys.list(type, params),
		queryFn: () => (type === 'news' ? getNewsCommentList({ ...params }) : getBoardCommentList({ ...params })),
		enabled: enabled && Number.isSafeInteger(params.id) && params.id > 0,
	});
};

// 모바일 댓글 리스트 조회
export const useCommentListInfiniteQuery = (type: PostType, params: GetCommentsRequest, enabled: boolean) => {
	return useInfiniteQuery({
		queryKey: commentKeys.list(type, { ...params, infinite: true }),
		queryFn: ({ pageParam }) =>
			type === 'news'
				? getNewsCommentList({ ...params, infinite: true, lastReply: pageParam })
				: getBoardCommentList({ ...params, infinite: true, lastReply: pageParam }),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => {
			if (!lastPage.meta.hasNext) return undefined;
			const lastData = lastPage.data;
			return lastData.at(-1)?.pk ?? undefined;
		},
		enabled: enabled && Number.isSafeInteger(params.id) && params.id > 0,
	});
};

// 댓글 생성
export const useCreateCommentMutation = (type: PostType) => {
	const queryClient = useQueryClient();
	const mutationFn = type === 'news' ? createNewsReply : createBoardReply;

	return useMutation<SuccessResponse<unknown>, unknown, CreateNewsReplyRequest | CreateBoardReplyRequest>({
		mutationFn,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: commentKeys.all }),
	});
};

// 댓글 수정
export const useEditCommentMutation = (type: PostType) => {
	const queryClient = useQueryClient();
	const mutationFn = type === 'news' ? patchNewsReply : patchBoardReply;

	return useMutation<SuccessResponse<unknown>, unknown, CommonPatchReplyRequest>({
		mutationFn,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: commentKeys.all }),
	});
};

// 전체 댓글 수
export const useTotalCommentCountQuery = (type: PostType, postId: number) => {
	return useQuery({
		queryKey: commentKeys.commentCount(type, postId),
		queryFn: async () => {
			const response = type === 'news' ? await getNewsDetail(postId) : await getBoardDetail(postId);
			return response?.data?.replies ?? 0;
		},
		enabled: Number.isSafeInteger(postId) && postId > 0,
	});
};
