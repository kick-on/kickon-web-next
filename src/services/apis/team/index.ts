import { SERVER_URL } from '@/services/config/constants';
import { GetTeamResponse } from './dto';

// 팀 조회
export const getTeam = async (league?: number, keyword?: string): Promise<GetTeamResponse | null> => {
	const params = new URLSearchParams();

	if (league !== undefined) {
		params.append('league', String(league));
	}

	if (keyword !== undefined) {
		params.append('keyword', keyword);
	}

	const response = await fetch(`${SERVER_URL}/api/team?${params.toString()}`);

	if (!response.ok) {
		let errorPayload: unknown;
		try {
			errorPayload = await response.json();
		} catch (error) {
			errorPayload = error; // response가 json이 아닌 경우 방어
		}
		console.error('팀 조회 실패:', errorPayload);
		return null;
	}
	return response.json();
};
