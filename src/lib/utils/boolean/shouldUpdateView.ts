import { getCookie, setCookie } from '@/lib/utils';

const VIEW_EXPIRY = 60 * 60 * 24 * 1000;

export function shouldUpdateView(key: string, pk: number) {
	// (24시간 이내 열람한 하프타임 pk):(열람 시각) 쌍의 객체
	const cookieValue = getCookie(key);
	let viewedHalftimes: Record<string, number> = {};

	if (cookieValue) {
		try {
			viewedHalftimes = JSON.parse(cookieValue);
		} catch {
			viewedHalftimes = {};
		}
	}

	const now = Date.now();
	const lastViewed = viewedHalftimes[pk];

	// 24시간이 지났거나, 처음 보는 하프타임이면 view 업데이트
	if (!lastViewed || now - lastViewed > VIEW_EXPIRY) {
		viewedHalftimes[pk] = now;
		setCookie(`viewedHalftimes`, JSON.stringify(viewedHalftimes), 60 * 60 * 24); // max-age(24시간) in seconds
		return true;
	}

	return false;
}
