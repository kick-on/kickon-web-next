import { SERVER_URL } from '@/services/config/constants';
import { GetBannerResposne } from './dto';

// 배너 게시글 조회
export const getBanner = async (): Promise<GetBannerResposne | null> => {
	const response = await fetch(`${SERVER_URL}/api/event-board`);

	if (!response.ok) {
		console.error(await response.json());
		return null;
	}
	return response.json();
};
