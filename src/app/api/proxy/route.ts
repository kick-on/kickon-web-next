// app/api/proxy/route.ts

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	// 쿠키에서 액세스 토큰을 읽음
	const cookieStore = await cookies();
	const token = cookieStore.get('accessToken'); // 쿠키에서 액세스 토큰을 가져옵니다.

	// 토큰이 없다면, 요청을 거절할 수 있음
	if (!token) {
		return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 });
	}

	try {
		// 백엔드 API 호출
		console.log(token);
		const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/actual-season-ranking?league=1`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.value}`, // 헤더에 토큰을 추가
			},
		});

		const data = await apiResponse.json();

		// 백엔드 API 응답을 클라이언트에 전달
		return NextResponse.json(data, { status: apiResponse.status });
	} catch (error) {
		console.error('Error fetching from backend:', error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
