import { SuccessResponse } from '@/services/config/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createVote, editVote } from '@/services/apis/poll/poll-vote.api';
import { CreateVoteRequest, EditVoteParams } from '@/services/apis/poll/poll-vote.type';
import { closePoll, getPoll } from '@/services/apis/poll/poll.api';

export const pollKeys = {
	all: ['poll'] as const,
	detail: (boardPk: number) => [...pollKeys.all, 'detail', boardPk] as const,
};

// 투표 조회
export const usePollQuery = (boardPk: number) => {
	return useQuery({
		queryKey: pollKeys.detail(boardPk),
		queryFn: () => getPoll(boardPk),
		enabled: Number.isInteger(boardPk),
		retry: 1,
	});
};

// 투표 참여
export const useCreateVoteMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<SuccessResponse<null>, unknown, CreateVoteRequest>({
		mutationFn: createVote,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: pollKeys.all }),
	});
};

// 재투표
export const useEditVoteMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<SuccessResponse<null>, unknown, EditVoteParams>({
		mutationFn: editVote,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: pollKeys.all }),
	});
};

// 투표 종료
export const useClosePollMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<SuccessResponse<null>, unknown, number>({
		mutationFn: closePoll,
		onSuccess: async () => await queryClient.invalidateQueries({ queryKey: pollKeys.all }),
	});
};
