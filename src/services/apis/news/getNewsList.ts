import { SERVER_URL } from '@/services/config/constants';
import { GetNewsListRequest, GetNewsListResponse } from './dto';

export const getNewsList = async ({
	team,
	size,
	page,
	order,
	league,
}: GetNewsListRequest): Promise<GetNewsListResponse | null> => {
	const params = new URLSearchParams();

	params.append('order', String(order));
	params.append('size', String(size));
	params.append('page', String(page));

	if (team !== undefined) params.append('team', String(team));
	if (league !== undefined) params.append('league', String(league));

	const response = await fetch(`${SERVER_URL}/api/news?${params.toString()}`);

	if (!response.ok) {
		console.error('뉴스 리스트 조회 실패: ', `${SERVER_URL}/api/news?${params.toString()}`, await response.json());
		return null;
	}
	return response.json();
};
