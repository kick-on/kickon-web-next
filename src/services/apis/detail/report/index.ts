import { MIMIZAE_JWT, SERVER_URL } from '@/services/config/constants';
import { PostReportDetailRequest } from './dto';
import { EmptySuccessResponse } from '@/services/config/dto';

export const postReportDetail = async (
	data: PostReportDetailRequest,
	isNews: boolean = false,
): Promise<EmptySuccessResponse> => {
	const endpoint = isNews ? '/api/report-news' : '/api/report-board';

	const response = await fetch(`${SERVER_URL}${endpoint}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${MIMIZAE_JWT}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('상세페이지 신고 실패 - 응답 상태:', response.status, response.statusText);
		console.error('서버 응답 본문:', errorText);
		throw new Error('상세페이지 신고 실패');
	}

	return response.json();
};
