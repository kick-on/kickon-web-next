import { JWT, SERVER_URL } from '@/services/config/constants';
import { GetDetailResponse } from './dto';

export const getDetailContent = async (type: 'news' | 'board', id: number): Promise<GetDetailResponse | null> => {
	const response = await fetch(`${SERVER_URL}/api/${type}/${id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${JWT}`,
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('상세페이지 조회 실패 - 응답 상태:', response.status, response.statusText);
		console.error('서버 응답 본문:', errorText);
		throw new Error('상세페이지 조회 실패');
	}
	return response.json();
};

// import { SERVER_URL } from '@/services/config/constants';
// import { GetDetailResponse } from './dto';
// const getAuthToken = (): string | null => {
// 	if (typeof window === 'undefined') return null; // SSR 방지
// 	return localStorage.getItem('accessToken');
// };

// export const getDetailContent = async (type: 'news' | 'board', id: number): Promise<GetDetailResponse | null> => {
// 	const token = getAuthToken(); // 로컬스토리지에서 토큰 가져오기

// 	const headers: HeadersInit = token
// 		? { Authorization: `Bearer ${token}` } // 토큰이 있으면 Authorization 추가
// 		: {}; // 없으면 빈 객체

// 	const response = await fetch(`${SERVER_URL}/api/${type}/${id}`, {
// 		method: 'GET',
// 		headers,
// 	});

// 	if (!response.ok) {
// 		const errorText = await response.text();
// 		console.error('상세페이지 조회 실패 - 응답 상태:', response.status, response.statusText);
// 		console.error('서버 응답 본문:', errorText);
// 		throw new Error('상세페이지 조회 실패');
// 	}
// 	return response.json();
// };
