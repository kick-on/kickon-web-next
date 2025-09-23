import { fetcher } from '@/lib/server/fetcher';
import { PatchGameGambleRequest, PostGameGambleRequest } from './dto';
import { EmptySuccessResponse } from '@/services/config/dto';

// 승부예측 생성
export const postGameGamble = async (body: PostGameGambleRequest) => {
	const response = await fetcher<EmptySuccessResponse>({
		method: 'POST',
		url: '/api/user-game-gamble',
		body,
	});

	return response;
};

// 승부예측 수정
export const patchGameGamble = async (body: PatchGameGambleRequest) => {
	const response = await fetcher<EmptySuccessResponse>({
		method: 'PATCH',
		url: '/api/user-game-gamble',
		body,
	});

	return response;
};

// 승부예측 삭제
export const deleteGameGamble = async (id: string) => {
	const response = await fetcher<EmptySuccessResponse>({
		method: 'DELETE',
		url: `/api/user-game-gamble?id=${id}`,
	});

	return response;
};
