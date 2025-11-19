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
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type PostType = 'news' | 'board';

export const commentKeys = {
	all: ['comment'] as const,
	list: (type: PostType, postId: number) => [...commentKeys.all, 'list', type, postId] as const,
	commentCount: (type: PostType, postId: number) => [...commentKeys.all, 'commentCount', type, postId] as const,
};

// 댓글 리스트 조회
export const useCommentListQuery = (type: PostType, params: Omit<GetCommentsRequest, 'page'>) => {
	const queryClient = useQueryClient();

	const getFinalParams = () => {
		if (params.infinite) {
			const data = queryClient.getQueryData<InfiniteData<GetNewsCommentsResponse, unknown>>(
				commentKeys.list(type, params.id),
			);

			const lastReply = data?.pages.at(-1).data.at(-1)?.pk;
			if (lastReply) {
				return { ...params, lastReply };
			}
		}
		return { ...params };
	};

	return useInfiniteQuery({
		queryKey: commentKeys.list(type, params.id),
		queryFn: ({ pageParam }) =>
			type === 'news'
				? getNewsCommentList({ ...getFinalParams(), page: pageParam })
				: getBoardCommentList({ ...getFinalParams(), page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => (lastPage.meta.hasNext ? lastPage.meta.currentPage + 1 : undefined),
		enabled: Number.isSafeInteger(params.id) && params.id > 0,
	});
};

// 댓글 생성
export const useCreateCommentMutation = (type: PostType) => {
	const queryClient = useQueryClient();
	const mutationFn = type === 'news' ? createNewsReply : createBoardReply;

	return useMutation<unknown, unknown, CreateNewsReplyRequest | CreateBoardReplyRequest>({
		mutationFn,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: commentKeys.all }),
	});
};

// 댓글 수정
export const useEditCommentMutation = (type: PostType) => {
	const queryClient = useQueryClient();
	const mutationFn = type === 'news' ? patchNewsReply : patchBoardReply;

	return useMutation<unknown, unknown, CommonPatchReplyRequest>({
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
