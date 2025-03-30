import { MIMIZAE_JWT, SERVER_URL } from '@/services/config/constants';
import { PostNewsContentsRequest } from './dto';

// TODO: 게시글까지...

export async function createNewPost(data: PostNewsContentsRequest) {
	console.log(data);
	try {
		const response = await fetch(`${SERVER_URL}/api/news`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${MIMIZAE_JWT}`,
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
	} catch (error) {
		console.error('postNewsContent 함수 에러:', error);
		throw error;
	}
}
