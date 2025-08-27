import { NextRequest, NextResponse } from 'next/server';
import { DOMAIN_URL, SERVER_URL } from '@/services/config/constants';

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
	const searchParams = req.nextUrl.searchParams;
	const errorCode = searchParams.get('errorCode');
	const accessToken = searchParams.get('accessToken');
	const refreshToken = searchParams.get('refreshToken');
	const { provider } = await params;

	const redirectUrl = new URL(DOMAIN_URL);
	const finalizePath = '/auth/finalize';

	// 에러 처리
	if (errorCode === 'FORBIDDEN_RESISTER') {
		redirectUrl.pathname = finalizePath;
		redirectUrl.searchParams.set('errorCode', 'REJOIN_LIMIT');
		return NextResponse.redirect(redirectUrl);
	}

	if (!accessToken || !refreshToken) {
		redirectUrl.pathname = finalizePath;
		redirectUrl.searchParams.set('errorCode', 'UNKNOWN');
		return NextResponse.redirect(redirectUrl);
	}

	// redirect 분기
	try {
		const userInfoResponse = await fetch(`${SERVER_URL}/api/user/me`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (userInfoResponse.ok) {
			// 200~299: 로그인 내역은 있는 경우
			const isSignedUp = !!(await userInfoResponse.json()).data.privacyAgreedAt;
			if (isSignedUp) {
				// 개인정보 동의 내역이 있는 경우 로그인 처리
				redirectUrl.pathname = finalizePath;
			} else {
				// 개인정보 동의 내역이 없는 경우 회원가입 페이지로 리디렉션
				redirectUrl.pathname = `/signup`;
				redirectUrl.searchParams.set('provider', provider);
			}
		} else if (userInfoResponse.status === 401 || userInfoResponse.status === 403) {
			// 401 or 403: 회원가입 페이지로 리디렉션
			redirectUrl.pathname = `/signup`;
			redirectUrl.searchParams.set('provider', provider);
		} else {
			// 그 외: errorCode와 함께 finalize 페이지로 리디렉션
			try {
				console.error(await userInfoResponse.json());
			} catch (error) {
				console.error(error);
			} finally {
				redirectUrl.pathname = finalizePath;
				redirectUrl.searchParams.set('errorCode', 'UNKNOWN');
				return NextResponse.redirect(redirectUrl);
			}
		}
	} catch (error) {
		// 시스템 에러: errorCode와 함께 finalize 페이지로 리디렉션
		console.error(error);

		redirectUrl.pathname = finalizePath;
		redirectUrl.searchParams.set('errorCode', 'UNKNOWN');
		return NextResponse.redirect(redirectUrl);
	}

	const response = NextResponse.redirect(redirectUrl);

	// 정상적으로 로그인 or 회원가입 한 경우 쿠키 설정
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

	if (redirectUrl.pathname === '/signup') {
		response.cookies.set({
			name: 'fromLogin',
			value: 'true',
			path: '/',
			maxAge: 60,
		});
	}

	return response;
}
