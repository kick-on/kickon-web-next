import { SERVER_URL } from '@/services/config/constants';
import { GetGamesRequest, GetGamesResponse } from './dto';

// 매치 리스트 조회
export const getGames = async ({ league, season, status }: GetGamesRequest): Promise<GetGamesResponse | null> => {
	const params = new URLSearchParams();

	params.append('league', String(league));
	params.append('season', String(season));
	params.append('status', String(status));

	const response = await fetch(`${SERVER_URL}/api/game?${params}`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
