import { SERVER_URL } from '@/services/config/constants';
import { GetActualSeasonRankingResponse, GetGambleSeasonRankingResponse } from './dto';

export const getGambleSeasonRanking = async (league: number): Promise<GetGambleSeasonRankingResponse | null> => {
	const params = new URLSearchParams({
		league: String(league),
	});
	const response = await fetch(`${SERVER_URL}/api/gamble-season-ranking?${params.toString()}`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};

export const getActualSeasonRanking = async (league: number): Promise<GetActualSeasonRankingResponse | null> => {
	const params = new URLSearchParams({
		league: String(league),
	});
	const response = await fetch(`${SERVER_URL}/api/gamble-season-ranking?${params.toString()}`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
