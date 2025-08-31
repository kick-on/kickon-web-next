import { NextResponse } from 'next/server';

export async function POST() {
	const response = NextResponse.json({ message: 'Logged out' });

	// 쿠키 삭제
	response.cookies.set('refreshToken', '', {
		httpOnly: true,
		secure: true,
		path: '/',
		maxAge: 0,
	});

	return response;
}
