import { DOMAIN_URL, SERVER_URL } from '@/services/config/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const currentRefreshToken = request.cookies.get('refreshToken')?.value;

		// refresh token이 없는 경우
		if (!currentRefreshToken) {
			return new NextResponse(JSON.stringify({ error: 'Missing refresh token' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const backendResponse = await fetch(`${SERVER_URL}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken: currentRefreshToken }),
		});

		// 토큰 재발급에 실패한 경우
		if (!backendResponse.ok) {
			const response = new NextResponse(JSON.stringify({ error: 'Failed to refresh token' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});

			response.cookies.set({
				name: 'refreshToken',
				value: '',
				httpOnly: true,
				secure: false,
				path: '/',
				maxAge: 0, // refresh token 삭제
			});

			return response;
		}

		const json = await backendResponse.json();
		const { accessToken, refreshToken } = json.data;

		// NextResponse 인스턴스를 생성하고 쿠키를 설정
		const response = new NextResponse(JSON.stringify({ accessToken }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});

		const isLocal = DOMAIN_URL === 'http://localhost:3000';
		if (refreshToken) {
			response.cookies.set({
				name: 'refreshToken',
				value: refreshToken,
				httpOnly: true,
				secure: !isLocal,
				path: '/',
				maxAge: 60 * 60 * 24 * 30, // 30일
			});
		}

		return response;
	} catch (error) {
		// 서버 오류(500 Internal Server Error)를 반환
		console.log(error);
		return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
