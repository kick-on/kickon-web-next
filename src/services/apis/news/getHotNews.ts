import { SERVER_URL } from '@/services/config/constants';
import { GetHotNewsResponse } from './dto';

export const getHotNews = async (): Promise<GetHotNewsResponse | null> => {
	try {
		const response = await fetch(`${SERVER_URL}/api/news/hot`);

		if (!response.ok) {
			let errorPayload: unknown;
			try {
				errorPayload = await response.json();
			} catch (error) {
				errorPayload = error; // response가 json이 아닌 경우 방어
			}
			console.error('TOP5 뉴스 조회 실패:', errorPayload);
			return null;
		}
		return response.json();
	} catch (error) {
		console.error('TOP5 FETCH 자체 실패: ', error);
		return null;
	}
};
