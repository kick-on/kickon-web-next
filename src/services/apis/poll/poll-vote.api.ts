import { fetcher } from '@/lib/server/fetcher';
import { SuccessResponse } from '@/services/config/dto';
import { CreateVoteRequest, EditVoteRequest } from '@/services/apis/poll/poll-vote.type';

// 투표 참여
export const createVote = async (body: CreateVoteRequest) => {
	const response = await fetcher<SuccessResponse<null>>({
		method: 'POST',
		url: `/api/pollVote`,
		body,
	});

	return response;
};

// 재투표
export const editVote = async (pollPk: number, body: EditVoteRequest) => {
	const response = await fetcher<SuccessResponse<null>>({
		method: 'PUT',
		url: `/api/pollVote/${pollPk}`,
		body,
	});

	return response;
};
