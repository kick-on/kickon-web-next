import { SERVER_URL } from '@/services/config/constants';
import { GetNewsListRequest, GetNewsListResponse } from './dto';
import axiosInstance from '@/services/config/axiosInstance';
import { FailResponse } from '@/services/config/dto';

export const getNewsList = async ({ team, size, page, order, league }: GetNewsListRequest) => {
	const params = new URLSearchParams();

	params.append('order', String(order));
	params.append('size', String(size));
	params.append('page', String(page));

	if (team !== undefined) params.append('team', String(team));
	if (league !== undefined) params.append('league', String(league));

	const response = await axiosInstance.get<GetNewsListResponse | FailResponse>(
		`${SERVER_URL}/api/news?${params.toString()}`,
	);
	console.log(`${SERVER_URL}/api/news?${params.toString()}`);

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error('뉴스 리스트 조회 실패: ', `${SERVER_URL}/api/news?${params.toString()}`, response);
		return null;
	}
	return response;
};
