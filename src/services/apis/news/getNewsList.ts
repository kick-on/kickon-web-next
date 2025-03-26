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

	if (order) params.append('team', String(team));
	if (league) params.append('league', String(league));

	const response = await fetch(`${SERVER_URL}/api/news?${params.toString()}`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
