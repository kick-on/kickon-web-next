import { createBoardReply, getBoardCommentList, patchBoardReply } from '@/services/apis/board/board-reply.api';
import { CreateBoardReplyRequest, CreateEditBoardReplyRespones } from '@/services/apis/board/board-reply.type';
import { PatchBoardDetailRequest } from '@/services/apis/board/board.type';
import { CommonPatchReplyRequest } from '@/services/apis/common/types';
import { createNewsReply, getNewsCommentList, patchNewsReply } from '@/services/apis/news/news-reply.api';
import { CreateEditNewsReplyRespones, CreateNewsReplyRequest } from '@/services/apis/news/news-reply.type';
import { GetCommentsRequest, PatchNewsDetailRequest } from '@/services/apis/news/news.type';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type PostType = 'news' | 'board';

export const commentKeys = {
	all: ['comment'] as const,
	list: (type: PostType, params: Omit<GetCommentsRequest, 'page'>) => [...commentKeys.all, type, params] as const,
};

export const useCommentListQuery = (type: PostType, params: Omit<GetCommentsRequest, 'page'>) => {
	return useInfiniteQuery({
		queryKey: commentKeys.list(type, params),
		queryFn: ({ pageParam }) =>
			type === 'news'
				? getNewsCommentList({ ...params, page: pageParam })
				: getBoardCommentList({ ...params, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => (lastPage.meta.hasNext ? lastPage.meta.currentPage + 1 : undefined),
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
