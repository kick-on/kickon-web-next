import { fetcher } from '@/lib/server/fetcher';
import { FailResponse } from '@/services/config/dto';
import {
	GetGamesRequest,
	GetGamesResponse,
	GetMyPredictionsRequest,
	GetMyPredictionsResponse,
	GetMyStatsResponse,
} from './dto';
import { appendParams } from '@/lib/server/appendParams';

// 매치 리스트 조회
export const getGames = async (req: GetGamesRequest): Promise<GetGamesResponse | null> => {
	const params = new URLSearchParams();
	appendParams(params, req);

	const response = await fetcher<GetGamesResponse | FailResponse>({
		method: 'GET',
		url: `/api/game?${params.toString()}`,
	});

	return response;
};

// 내가 참여한 예측 리스트 조회
export const getMyPredictions = async (req: GetMyPredictionsRequest): Promise<GetMyPredictionsResponse | null> => {
	const params = new URLSearchParams();
	appendParams(params, req);

	const response = await fetcher<GetMyPredictionsResponse | FailResponse>({
		method: 'GET',
		url: `/api/game/my-predictions?${params.toString()}`,
	});

	return response;
};

// 예측 통계 조회
export const getMyStats = async (): Promise<GetMyStatsResponse | null> => {
	const response = await fetcher<GetMyStatsResponse | FailResponse>({
		method: 'GET',
		url: '/api/game/my-stats',
	});

	return response;
};
