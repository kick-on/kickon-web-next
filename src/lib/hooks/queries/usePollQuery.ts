import { SuccessResponse } from '@/services/config/dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVote, editVote } from '@/services/apis/poll/poll-vote.api';
import { CreateVoteRequest, EditVoteParams } from '@/services/apis/poll/poll-vote.type';
import { closePoll } from '@/services/apis/poll/poll.api';

export const pollKeys = {
	all: ['poll'] as const,
};

// 투표 참여
export const useCreateVoteMutation = (boardPk: number) => {
	const queryClient = useQueryClient();

	return useMutation<SuccessResponse<null>, unknown, CreateVoteRequest>({
		mutationFn: createVote,
		// TODO: boardPk를 사용해서 게시글 상세 조회 query invalidate
		onSuccess: async () => await queryClient.invalidateQueries({}),
	});
};

// 재투표
export const useEditVoteMutation = (boardPk: number) => {
	const queryClient = useQueryClient();

	return useMutation<SuccessResponse<null>, unknown, EditVoteParams>({
		mutationFn: editVote,
		// TODO: boardPk를 사용해서 게시글 상세 조회 query invalidate
		onSuccess: async () => await queryClient.invalidateQueries({}),
	});
};

// 투표 종료
export const useClosePollMutation = (boardPk: number) => {
	const queryClient = useQueryClient();

	return useMutation<SuccessResponse<null>, unknown, number>({
		mutationFn: closePoll,
		// TODO: boardPk를 사용해서 게시글 상세 조회 query invalidate
		onSuccess: async () => await queryClient.invalidateQueries({}),
	});
};
