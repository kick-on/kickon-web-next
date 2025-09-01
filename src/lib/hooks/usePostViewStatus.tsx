import { useEffect, useState } from 'react';
import { getCookie, setCookie } from '@/lib/utils';

const POST_VIEW_EXPIRY = 60 * 60 * 24 * 1000;

export default function usePostViewStatus(id: number) {
	const [shouldCallApi, setShouldCallApi] = useState(false);

	useEffect(() => {
		// (24시간 이내 열람한 게시글 id):(열람 시각) 쌍의 객체
		const cookieValue = getCookie('viewedPosts');
		let viewedPosts: Record<string, number> = {};

		if (cookieValue) {
			try {
				viewedPosts = JSON.parse(cookieValue);
			} catch {
				viewedPosts = {};
			}
		}

		const now = Date.now();
		const lastViewed = viewedPosts[id];

		// 24시간이 지났거나, 처음 보는 글이면 API 호출
		if (!lastViewed || now - lastViewed > POST_VIEW_EXPIRY) {
			setShouldCallApi(true);
			viewedPosts[id] = now;
			setCookie('viewedPosts', JSON.stringify(viewedPosts), 60 * 60 * 24); // max-age(24시간) in seconds
		}
	}, [id]);
	return shouldCallApi;
}
