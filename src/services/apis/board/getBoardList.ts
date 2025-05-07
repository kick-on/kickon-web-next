import { SERVER_URL } from '@/services/config/constants';
import { GetBoardListRequest, GetBoardListResponse } from './dto';
import axiosInstance from '@/services/config/axiosInstance';

export const getBoardList = async ({
	team,
	size,
	page,
	order,
	infinite,
	lastBoard,
	lastViewCount,
}: GetBoardListRequest) => {
	const params = new URLSearchParams();

	params.append('size', String(size));
	params.append('page', String(page));
	params.append('order', String(order));
	// 무한 스크롤
	if (infinite !== undefined) params.append('infinite', String(infinite));
	if (lastBoard !== undefined) params.append('lastNews', String(lastBoard));
	if (lastViewCount !== undefined) params.append('lastViewCount', String(lastViewCount));

	if (team !== undefined) params.append('team', String(team));

	const response = await axiosInstance.get<GetBoardListResponse | null>(`${SERVER_URL}/api/board?${params.toString()}`);

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error('게시글 리스트 조회 실패: ', `${SERVER_URL}/api/board?${params.toString()}`, response);
		return null;
	}
	return response;
};
