import { SERVER_URL } from '@/services/config/constants';
import { GetHotNewsResponse } from './dto';

export const getHotNews = async (): Promise<GetHotNewsResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/news/hot`);

	if (!response.ok) {
		console.error('TOP5 뉴스 조회 실패: ', await response.json());
		return null;
	}
	return response.json();
};
