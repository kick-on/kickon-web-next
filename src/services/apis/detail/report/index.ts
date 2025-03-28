import { MIMIZAE_JWT, SERVER_URL } from '@/services/config/constants';
import { PostReportDetailRequest } from './dto';

export const postReport = async (data: PostReportDetailRequest, isNews: boolean = false): Promise<null> => {
	const endpoint = isNews ? 'report-news' : 'report-board';

	const response = await fetch(`${SERVER_URL}/api/${endpoint}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${MIMIZAE_JWT}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		console.error(`${endpoint} 실패:`, await response.json());
		return null;
	}

	return response.json();
};
