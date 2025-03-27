import { SERVER_URL } from '@/services/config/constants';
import { GetActualSeasonRankingResponse, GetGambleSeasonRankingResponse } from './dto';

// 승부예측 순위 조회
export const getGambleSeasonRanking = async (league: number): Promise<GetGambleSeasonRankingResponse | null> => {
	const params = new URLSearchParams({
		league: String(league),
	});
	const response = await fetch(`${SERVER_URL}/api/gamble-season-ranking?${params}`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};

// 시즌 순위 조회
export const getActualSeasonRanking = async (league: number): Promise<GetActualSeasonRankingResponse | null> => {
	const params = new URLSearchParams({
		league: String(league),
	});
	const response = await fetch(`${SERVER_URL}/api/gamble-season-ranking?${params}`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
