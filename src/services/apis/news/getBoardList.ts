import { SERVER_URL } from '@/services/config/constants';
import { GetBoardListRequest, GetBoardListResponse } from './dto';

export const getBoardList = async ({
	team,
	size,
	page,
	order,
}: GetBoardListRequest): Promise<GetBoardListResponse | null> => {
	const params = new URLSearchParams();

	params.append('order', String(order));
	params.append('size', String(size));
	params.append('page', String(page));

	if (team !== undefined) params.append('team', String(team));

	const response = await fetch(`${SERVER_URL}/api/board?${params.toString()}`);

	if (!response.ok) {
		console.error('게시글 리스트 조회 실패: ', `${SERVER_URL}/api/board?${params.toString()}`, await response.json());
		return null;
	}
	return response.json();
};
