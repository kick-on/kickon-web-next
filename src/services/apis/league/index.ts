import { SERVER_URL } from '@/services/config/constants';
import { GetLeagueResponse } from './dto';

// 리그 조회
export const getLeague = async (): Promise<GetLeagueResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/league`);

	if (!response.ok) {
		let errorPayload: unknown;
		try {
			errorPayload = await response.json();
		} catch (error) {
			errorPayload = error; // response가 json이 아닌 경우 방어
		}
		console.error('리그 조회 실패:', errorPayload);
		return null;
	}
	return response.json();
};
