import { SERVER_URL } from '@/services/config/constants';
import { GetGamesRequest, GetGamesResponse, PatchGameGambleRequest, PostGameGambleRequest } from './dto';
import axiosInstance from '@/services/config/axiosInstance';
import { EmptySuccessResponse, FailResponse } from '@/services/config/dto';

// 매치 리스트 조회
export const getGames = async ({ league, season, status }: GetGamesRequest): Promise<GetGamesResponse | null> => {
	const params = new URLSearchParams();

	params.append('league', String(league));
	params.append('season', String(season));
	params.append('status', String(status));

	const response = await fetch(`${SERVER_URL}/api/game?${params}`);

	if (!response.ok) {
		console.error('게임 리스트 조회 실패:', await response.json());
		return null;
	}
	return response.json();
};

// 승부예측 생성
export const postGameGamble = async (body: PostGameGambleRequest) => {
	try {
		const response = await axiosInstance.post<EmptySuccessResponse | FailResponse>('/api/user-game-gamble', body);

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
		const response = await axiosInstance.patch<EmptySuccessResponse | FailResponse>('/api/user-game-gamble', body);

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
		const response = await axiosInstance.delete<EmptySuccessResponse | FailResponse>(`/api/user-game-gamble?id=${id}`);

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('승부예측 삭제 실패: ', error);
	}
};
