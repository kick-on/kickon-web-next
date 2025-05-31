import { SERVER_URL } from '@/services/config/constants';
import { GetBannerResposne } from './dto';

// 배너 게시글 조회
export const getBanner = async (): Promise<GetBannerResposne | null> => {
	const response = await fetch(`${SERVER_URL}/api/event-board`);

	if (!response.ok) {
		let errorPayload: unknown;
		try {
			errorPayload = await response.json();
		} catch (error) {
			errorPayload = error; // response가 json이 아닌 경우 방어
		}
		console.error('배너 조회 실패:', errorPayload);
		return null;
	}
	return response.json();
};
