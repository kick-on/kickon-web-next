import { SERVER_URL } from '@/services/config/constants';
import { GetActualSeasonRankingResponse, GetGambleSeasonRankingResponse } from './ranking.type';

// 실제 시즌 순위 조회
export const getActualSeasonRanking = async (league: number): Promise<GetActualSeasonRankingResponse | null> => {
	const params = new URLSearchParams({
		league: String(league),
	});
	const response = await fetch(`${SERVER_URL}/api/actual-season-ranking?${params}`);

	if (!response.ok) {
		let errorPayload: unknown;
		try {
			errorPayload = await response.json();
		} catch (error) {
			errorPayload = error; // response가 json이 아닌 경우 방어
		}
		console.error('경기 랭킹 조회 실패:', errorPayload);
		return null;
	}
	return response.json();
};

// 승부예측 순위 조회
export const getGambleSeasonRanking = async (league: number): Promise<GetGambleSeasonRankingResponse | null> => {
	const params = new URLSearchParams({
		league: String(league),
	});
	const response = await fetch(`${SERVER_URL}/api/gamble-season-ranking?${params.toString()}`);

	if (!response.ok) {
		let errorPayload: unknown;
		try {
			errorPayload = await response.json();
		} catch (error) {
			errorPayload = error; // response가 json이 아닌 경우 방어
		}
		console.error('예측 랭킹 조회 실패:', errorPayload);
		return null;
	}
	return response.json();
};
