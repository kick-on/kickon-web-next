import { fetcher } from '@/lib/server/fetcher';
import { GetGamesRequest, GetGamesResponse, PatchGameGambleRequest, PostGameGambleRequest } from './dto';
import { EmptySuccessResponse, FailResponse } from '@/services/config/dto';

// 매치 리스트 조회
export const getGames = async ({ league, status }: GetGamesRequest): Promise<GetGamesResponse | null> => {
	const params = new URLSearchParams();

	params.append('league', String(league));
	params.append('status', String(status));

	const response = await fetcher<GetGamesResponse | FailResponse>({
		method: 'GET',
		url: `/api/game?${params.toString()}`,
	});

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error('게임 리스트 조회 실패:', response);
		return null;
	}
	return response;
};

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
