import { SERVER_URL } from '@/services/config/constants';
import { GetLeagueResponse } from './dto';

// 승부예측 순위 조회
export const getLeague = async (): Promise<GetLeagueResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/league`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
