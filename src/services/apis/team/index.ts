import { SERVER_URL } from '@/services/config/constants';
import { GetTeamResponse } from './dto';

// 승부예측 순위 조회
export const getTeam = async (league: number, keyword: string): Promise<GetTeamResponse | null> => {
	const params = new URLSearchParams({
		league: String(league),
		keyword,
	});
	const response = await fetch(`${SERVER_URL}/api/team?${params.toString()}`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
