import { fetcher } from '@/lib/server/fetcher';
import { PatchGameGambleRequest, PostGameGambleRequest } from './dto';
import { EmptySuccessResponse, FailResponse } from '@/services/config/dto';

// 승부예측 생성
export const postGameGamble = async (body: PostGameGambleRequest) => {
	try {
		const response = await fetcher<EmptySuccessResponse | FailResponse>({
			method: 'POST',
			url: '/api/user-game-gamble',
			body,
		});

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('승부예측 생성 실패: ', error);
	}
};

// 승부예측 수정
export const patchGameGamble = async (body: PatchGameGambleRequest) => {
	try {
		const response = await fetcher<EmptySuccessResponse | FailResponse>({
			method: 'PATCH',
			url: '/api/user-game-gamble',
			body,
		});

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('승부예측 수정 실패: ', error);
	}
};

// 승부예측 삭제
export const deleteGameGamble = async (id: string) => {
	try {
		const response = await fetcher<EmptySuccessResponse | FailResponse>({
			method: 'DELETE',
			url: `/api/user-game-gamble?id=${id}`,
		});

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('승부예측 삭제 실패: ', error);
	}
};
