import { SERVER_URL } from '@/services/config/constants';
import { GetNewsListRequest, GetNewsListResponse } from './dto';
import axiosInstance from '@/services/config/axiosInstance';
import { FailResponse } from '@/services/config/dto';

export const getNewsList = async ({
	team,
	size,
	page,
	order,
	league,
	infinite,
	lastNews,
	lastViewCount,
}: GetNewsListRequest) => {
	const params = new URLSearchParams();

	params.append('order', String(order));
	params.append('size', String(size));
	params.append('page', String(page));

	if (team !== undefined) params.append('team', String(team));
	if (league !== undefined) params.append('league', String(league));
	// 무한 스크롤
	if (infinite !== undefined) params.append('infinite', String(infinite));
	if (lastNews !== undefined) params.append('lastNews', String(lastNews));
	if (lastViewCount !== undefined) params.append('lastViewCount', String(lastViewCount));

	try {
		const response = await axiosInstance.get<GetNewsListResponse | FailResponse>(
			`${SERVER_URL}/api/news?${params.toString()}`,
		);

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error('뉴스 리스트 조회 실패: ', `${SERVER_URL}/api/news?${params.toString()}`, response);
			return null;
		}

		return response;
	} catch (error) {
		console.error('뉴스 리스트 조회 실패: ', `${SERVER_URL}/api/news?${params.toString()}`, error);
	}
};
