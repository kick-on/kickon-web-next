import { MIMIZAE_JWT, SERVER_URL } from '@/services/config/constants';

export const postContentLike = async (id: number, isNews: boolean = false): Promise<boolean> => {
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
		console.error(`${endpoint} 실패:`, await response.json());
		return false;
	}

	return response.json();
};
