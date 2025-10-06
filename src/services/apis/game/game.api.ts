import { fetcher } from '@/lib/server/fetcher';
import {
	GetGamesRequest,
	GetGamesResponse,
	GetMyPredictionsRequest,
	GetMyPredictionsResponse,
	GetMyStatsResponse,
} from './game.type';
import { appendParams } from '@/lib/server/appendParams';

// 매치 리스트 조회
export const getGames = async (req: GetGamesRequest): Promise<GetGamesResponse | null> => {
	const params = new URLSearchParams();
	appendParams(params, req);

	const response = await fetcher<GetGamesResponse>({
		method: 'GET',
		url: `/api/game?${params.toString()}`,
	});

	return response;
};

// 내가 참여한 예측 리스트 조회
export const getMyPredictions = async (req: GetMyPredictionsRequest): Promise<GetMyPredictionsResponse> => {
	const params = new URLSearchParams();
	appendParams(params, req);

	const response = await fetcher<GetMyPredictionsResponse>({
		method: 'GET',
		url: `/api/game/my-predictions?${params.toString()}`,
	});

	return response;
};

// 예측 통계 조회
export const getMyStats = async (): Promise<GetMyStatsResponse> => {
	const response = await fetcher<GetMyStatsResponse>({
		method: 'GET',
		url: '/api/game/my-stats',
	});

	return response;
};
