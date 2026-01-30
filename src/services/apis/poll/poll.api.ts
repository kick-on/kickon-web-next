import { fetcher } from '@/lib/server/fetcher';
import { SuccessResponse } from '@/services/config/dto';
import { CreatePollRequest, CreatePollResponse, GetPollResponse } from '@/services/apis/poll/poll.type';

// 투표 조회
export const getPoll = async (boardPk: number) => {
	const response = await fetcher<GetPollResponse>({
		method: 'GET',
		url: `/api/poll/${boardPk}`,
	});

	return response;
};

// 투표 생성
export const createPoll = async (body: CreatePollRequest) => {
	const response = await fetcher<CreatePollResponse>({
		method: 'POST',
		url: `/api/poll`,
		body,
	});

	return response;
};

// 투표 종료
export const closePoll = async (pollPk: number) => {
	const response = await fetcher<SuccessResponse<null>>({
		method: 'POST',
		url: `/api/poll/${pollPk}/close`,
	});

	return response;
};
