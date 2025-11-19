import { createBoardReply, getBoardCommentList, patchBoardReply } from '@/services/apis/board/board-reply.api';
import { CreateBoardReplyRequest, CreateEditBoardReplyRespones } from '@/services/apis/board/board-reply.type';
import { PatchBoardDetailRequest } from '@/services/apis/board/board.type';
import { CommonPatchReplyRequest } from '@/services/apis/common/types';
import { createNewsReply, getNewsCommentList, patchNewsReply } from '@/services/apis/news/news-reply.api';
import {
	CreateEditNewsReplyRespones,
	CreateNewsReplyRequest,
	GetNewsCommentsResponse,
} from '@/services/apis/news/news-reply.type';
import { GetCommentsRequest, PatchNewsDetailRequest } from '@/services/apis/news/news.type';
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type PostType = 'news' | 'board';

export const commentKeys = {
	all: ['comment'] as const,
	list: (type: PostType, params: Omit<GetCommentsRequest, 'page'>) => [...commentKeys.all, type, params.id] as const,
};

export const useCommentListQuery = (type: PostType, params: Omit<GetCommentsRequest, 'page'>) => {
	const queryClient = useQueryClient();

	const getFinalParams = () => {
		if (params.infinite) {
			const data = queryClient.getQueryData<InfiniteData<GetNewsCommentsResponse, unknown>>(
				commentKeys.list(type, params),
			);

			const lastReply = data?.pages.at(-1).data.at(-1)?.pk;
			if (lastReply) {
				return { ...params, lastReply };
			}
		}
		return { ...params };
	};

	return useInfiniteQuery({
		queryKey: commentKeys.list(type, params),
		queryFn: ({ pageParam }) =>
			type === 'news'
				? getNewsCommentList({ ...getFinalParams(), page: pageParam })
				: getBoardCommentList({ ...getFinalParams(), page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => (lastPage.meta.hasNext ? lastPage.meta.currentPage + 1 : undefined),
		enabled: Number.isSafeInteger(params.id) && params.id > 0,
	});
};

export const useCreateCommentMutation = (type: PostType) => {
	const queryClient = useQueryClient();
	const mutationFn = type === 'news' ? createNewsReply : createBoardReply;

	return useMutation<unknown, unknown, CreateNewsReplyRequest | CreateBoardReplyRequest>({
		mutationFn,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: commentKeys.all }),
	});
};

export const useEditCommentMutation = (type: PostType) => {
	const queryClient = useQueryClient();
	const mutationFn = type === 'news' ? patchNewsReply : patchBoardReply;

	return useMutation<unknown, unknown, CommonPatchReplyRequest>({
		mutationFn,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: commentKeys.all }),
	});
};
