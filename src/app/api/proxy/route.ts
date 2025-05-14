// app/api/proxy/route.ts

import { DOMAIN_URL, SERVER_URL } from '@/services/config/constants';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface ProxyParameter {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	endpoint: string;
	headers?: Record<string, string>;
	body?: Record<string, string>;
}

export async function POST(req: Request) {
	const { method, endpoint, headers, body }: ProxyParameter = await req.json();

	const requestOrigin = req.headers.get('origin');
	const allowedOrigin = DOMAIN_URL;

	// 다른 origin에서 호출 시 에러 반환 (csrf 방어)
	if (!requestOrigin || requestOrigin !== allowedOrigin) {
		return NextResponse.json({ message: 'Forbidden: invalid origin' }, { status: 403 });
	}

	// 쿠키에서 액세스 토큰을 읽음
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('accessToken'); // 쿠키에서 액세스 토큰을 가져옵니다.
	const hasToken = !!accessToken;

	try {
		// 백엔드 API 호출
		const hasBody = body !== undefined;
		const apiResponse = await fetch(`${SERVER_URL}${endpoint}`, {
			method: method,
			headers: {
				...(hasToken ? { Authorization: `Bearer ${accessToken.value}` } : {}), // 토큰이 있는 경우 헤더에 토큰을 추가
				...(hasBody ? { 'Content-Type': 'application/json' } : {}), // body가 있는 경우 헤더에 속성 추가
				...headers, // 기타 추가 헤더 설정
			},
			body: hasBody ? JSON.stringify(body) : undefined, // body가 있는 경우 바디 추가
		});

		const data = await apiResponse.json();

		// 백엔드 API 응답을 클라이언트에 전달
		return NextResponse.json(data, { status: apiResponse.status });
	} catch (error) {
		console.error('Error fetching from backend:', error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
