import { MIMIZAE_JWT, SERVER_URL } from '@/services/config/constants';
import { EmptySuccessResponse } from '@/services/config/dto';

export const postContentLike = async (id: number, isNews: boolean = false): Promise<EmptySuccessResponse> => {
	const body = JSON.stringify({ [isNews ? 'news' : 'board']: id });

	const endpoint = isNews ? 'news-kick' : 'board-kick';
	console.log(body);
	const response = await fetch(`${SERVER_URL}/api/${endpoint}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${MIMIZAE_JWT}`,
			'Content-Type': 'application/json',
		},
		body,
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('상세페이지 킥 요청 실패 - 응답 상태:', response.status, response.statusText);
		console.error('서버 응답 본문:', errorText);
		throw new Error('상세페이지 킥 요청 실패');
	}

	return response.json();
};
