import { ProxyParameter } from '@/app/api/proxy/route';
import { SERVER_URL } from '@/services/config/constants';
import { NextResponse } from 'next/server';

export default async function callBackendApi({
	method,
	url,
	headers,
	body,
	accessToken,
	refreshToken,
	retry = false,
}: ProxyParameter & { accessToken: string; refreshToken?: string; retry?: boolean }) {
	const hasBody = !!body;

	// 백엔드 api 호출
	const response = await fetch(`${SERVER_URL}${url}`, {
		method,
		headers: {
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...(hasBody ? { 'Content-Type': 'application/json' } : {}),
			...headers,
		},
		body: hasBody ? JSON.stringify(body) : undefined,
	});

	// 첫 번째 api 호출에서(무한 루프 방지)
	// 인증 에러가 뜨고, refreshToken이 있는 경우
	// 토큰 재발급
	if (!retry && (response.status === 401 || response.status === 403) && refreshToken) {
		const refreshResponse = await fetch(`${SERVER_URL}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken }),
		});

		// 재발급 성공
		if (refreshResponse.ok) {
			const { data } = await refreshResponse.json();
			const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

			// api 다시 호출
			const retriedResponse = await callBackendApi({
				method,
				url,
				headers,
				body,
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
				retry: true,
			});

			// retriedResponse에 쿠키를 추가
			if (typeof newAccessToken === 'string') {
				retriedResponse.cookies.set({
					name: 'accessToken',
					value: newAccessToken,
					httpOnly: true,
					secure: true,
					path: '/',
					maxAge: 60 * 60,
				});
			}

			if (typeof newRefreshToken === 'string') {
				retriedResponse.cookies.set({
					name: 'refreshToken',
					value: newRefreshToken,
					httpOnly: true,
					secure: true,
					path: '/',
					maxAge: 60 * 60 * 24 * 30,
				});
			}

			// 재시도 api 응답 (새 토큰을 정상적으로 발급받아 다시 시도한 경우)
			return retriedResponse;
		} else {
			// 재발급 실패
			// 토큰 발급 에러 응답 (새 토큰 발급에 실패한 경우)
			return NextResponse.json({ message: 'Token refresh failed' }, { status: 401 });
		}
	}

	// 기본 api 응답 (새 토큰 발급을 시도하지 않은 경우)
	// ex. accessToken이 정상적으로 있었던 경우 또는 refreshToken 자체가 없는 경우 등
	const data = await response.json();
	return NextResponse.json(data, { status: response.status });
}
