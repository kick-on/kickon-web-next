import { fetcher } from '@/lib/server/fetcher';
import { FailResponse } from '@/services/config/dto';
import {
	GetGamesRequest,
	GetGamesResponse,
	GetMyPredictionsRequest,
	GetMyPredictionsResponse,
	GetMyStatsResponse,
} from './dto';

// 매치 리스트 조회
export const getGames = async ({
	league,
	status,
	team,
	from,
	to,
}: GetGamesRequest): Promise<GetGamesResponse | null> => {
	const params = new URLSearchParams();

	params.append('league', String(league));
	params.append('status', String(status));

	if (team !== undefined) {
		params.append('team', String(team));
	}
	if (from !== undefined) {
		params.append('from', from);
	}
	if (to !== undefined) {
		params.append('to', to);
	}

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

// 내가 참여한 예측 리스트 조회
export const getMyPredictions = async ({
	from,
	to,
}: GetMyPredictionsRequest): Promise<GetMyPredictionsResponse | null> => {
	const params = new URLSearchParams();

	params.append('from', from);
	params.append('to', to);

	const response = await fetcher<GetMyPredictionsResponse | FailResponse>({
		method: 'GET',
		url: `/api/game/my-predictions?${params.toString()}`,
	});

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error('참여한 예측 리스트 조회 실패:', response);
		return null;
	}
	return response;
};

// 예측 통계 조회
export const getMyStats = async (): Promise<GetMyStatsResponse | null> => {
	const response = await fetcher<GetMyStatsResponse | FailResponse>({
		method: 'GET',
		url: '/api/game/my-stats',
	});

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error('예측 통계 조회 실패:', response);
		return null;
	}
	return response;
};
