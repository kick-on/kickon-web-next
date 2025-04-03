import { SERVER_URL } from '@/services/config/constants';
import { EmptySuccessResponse } from '@/services/config/dto';
import { PostContentViewRequest } from './dto';

interface PostContentViewProps {
	requestBody: PostContentViewRequest;
	isNews?: boolean;
}

export const PostContentView = async ({
	requestBody,
	isNews = false,
}: PostContentViewProps): Promise<EmptySuccessResponse> => {
	const endpoint = isNews ? 'news-view-history' : 'board-view-history';
	console.log(requestBody);

	const response = await fetch(`${SERVER_URL}/api/${endpoint}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestBody),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('뷰 생성 실패 - 응답 상태:', response.status, response.statusText);
		console.error('서버 응답 본문:', errorText);
		throw new Error('뷰 생성 실패');
	}

	return response.json();
};
