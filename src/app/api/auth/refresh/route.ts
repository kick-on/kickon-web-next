import { SERVER_URL } from '@/services/config/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function POST({ request }: { request: NextRequest }) {
	try {
		const currentRefreshToken = request.cookies.get('refreshToken')?.value;
		console.log('currentRefreshToken', currentRefreshToken);

		// refresh token이 없는 경우
		if (!currentRefreshToken) {
			return new NextResponse(JSON.stringify({ error: 'Missing refresh token' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const backendResponse = await fetch(`${SERVER_URL}/api/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken: currentRefreshToken }),
		});

		// 토큰 재발급에 실패한 경우
		if (!backendResponse.ok) {
			return new NextResponse(JSON.stringify({ error: 'Failed to refresh token' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const { accessToken, refreshToken } = await backendResponse.json();

		// NextResponse 인스턴스를 생성하고 쿠키를 설정
		const response = new NextResponse(JSON.stringify({ accessToken }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});

		if (typeof accessToken === 'string') {
			response.cookies.set({
				name: 'accessToken',
				value: accessToken,
				httpOnly: false,
				secure: true,
				path: '/',
				maxAge: 60 * 60, // 1시간
			});
		}

		if (typeof refreshToken === 'string') {
			response.cookies.set({
				name: 'refreshToken',
				value: refreshToken,
				httpOnly: true,
				secure: true,
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
