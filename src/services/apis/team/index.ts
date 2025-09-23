import { SERVER_URL } from '@/services/config/constants';
import { GetTeamResponse } from './dto';
import { appendParams } from '@/lib/server/appendParams';

// 팀 조회
export const getTeam = async (league?: number, keyword?: string): Promise<GetTeamResponse | null> => {
	const params = new URLSearchParams();
	appendParams(params, { league, keyword });

	const response = await fetch(`${SERVER_URL}/api/team?${params.toString()}`);
	return response.json();
};
