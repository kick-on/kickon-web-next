import { JWT, SERVER_URL } from '@/services/config/constants';
import { PostNewsContentsRequest } from './dto';

export async function postNewContents(data: PostNewsContentsRequest, isNews: boolean = false) {
	const endpoint = isNews ? '/api/news' : '/api/board';
	console.log(data); // 디버깅

	const response = await fetch(`${SERVER_URL}${endpoint}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${JWT}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('API 요청 실패 - 응답 상태:', response.status, response.statusText);
		console.error('서버 응답 본문:', errorText);
		throw new Error('API 요청 실패');
	}

	return response;
}
