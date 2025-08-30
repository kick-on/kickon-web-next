import { fetcher } from '@/lib/server/fetcher';
import { PatchGameGambleRequest, PostGameGambleRequest } from './dto';
import { EmptySuccessResponse, FailResponse } from '@/services/config/dto';

// 승부예측 생성
export const postGameGamble = async (body: PostGameGambleRequest) => {
	const response = await fetcher<EmptySuccessResponse | FailResponse>({
		method: 'POST',
		url: '/api/user-game-gamble',
		body,
	});

	return response;
};

// 승부예측 수정
export const patchGameGamble = async (body: PatchGameGambleRequest) => {
	const response = await fetcher<EmptySuccessResponse | FailResponse>({
		method: 'PATCH',
		url: '/api/user-game-gamble',
		body,
	});

	return response;
};

// 승부예측 삭제
export const deleteGameGamble = async (id: string) => {
	const response = await fetcher<EmptySuccessResponse | FailResponse>({
		method: 'DELETE',
		url: `/api/user-game-gamble?id=${id}`,
	});

	return response;
};
