import { SERVER_URL } from '@/services/config/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { provider: string } }) {
	const searchParams = req.nextUrl.searchParams;
	const errorCode = searchParams.get('errorCode');
	const accessToken = searchParams.get('accessToken');
	const refreshToken = searchParams.get('refreshToken');
	const provider = params.provider;

	// 에러 처리
	if (errorCode === 'FORBIDDEN_RESISTER') {
		const redirectUrl = new URL('/', req.nextUrl.origin);
		redirectUrl.searchParams.set('error', '탈퇴 후 7일이 지나지 않아 재가입할 수 없습니다.');
		return NextResponse.redirect(redirectUrl);
	}

	if (!accessToken || !refreshToken) {
		const redirectUrl = new URL('/', req.nextUrl.origin);
		redirectUrl.searchParams.set('error', '알 수 없는 오류가 발생했습니다.');
		return NextResponse.redirect(redirectUrl);
	}

	// TODO: error를 상태코드로 관리(query에 error message가 들어가는 방식을 수정)
	// redirect 분기
	const redirectUrl = new URL(req.nextUrl.origin);
	console.log('redirectUrl: ', redirectUrl);

	try {
		const userInfoResponse = await fetch(`${SERVER_URL}/api/user/me`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (userInfoResponse.ok) {
			// 200~299: 로그인 완료 페이지로 리디렉션
			redirectUrl.pathname = '/auth/finalize';
		} else if (userInfoResponse.status === 401 || userInfoResponse.status === 403) {
			// 401 or 403: 회원가입 페이지로 리디렉션
			redirectUrl.pathname = `/signup?provider=${provider}`;
		} else {
			// 그 외: 바로 홈으로 리디렉션
			console.error(await userInfoResponse.json());

			const redirectUrl = new URL('/', req.nextUrl.origin);
			redirectUrl.searchParams.set('error', '알 수 없는 오류가 발생했습니다.');
			return NextResponse.redirect(redirectUrl);
		}
	} catch (error) {
		// 시스템 에러: 바로 홈으로 리디렉션
		console.error(error);

		const redirectUrl = new URL('/', req.nextUrl.origin);
		redirectUrl.searchParams.set('error', '알 수 없는 오류가 발생했습니다.');
		return NextResponse.redirect(redirectUrl);
	}

	const response = NextResponse.redirect(redirectUrl);

	if (typeof accessToken === 'string') {
		response.cookies.set({
			name: 'accessToken',
			value: accessToken,
			httpOnly: true,
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
}
