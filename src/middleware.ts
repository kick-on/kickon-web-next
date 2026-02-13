import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ALLOWED_ROUTES = ['/', '/login', '/signup', '/auth', '/withdrawal', '/profile-setting', '/ranking', '/notice', '/404'];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// matcher가 거르지 못한 나머지 정적 파일(.png, .jpg, .svg 등) 통과
	if (pathname.includes('.')) {
		return NextResponse.next();
	}

	const isProd = process.env.NEXT_PUBLIC_NODE_ENV === 'prod';
	const isAllowed = ALLOWED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

	if (isProd && !isAllowed) {
		return NextResponse.redirect(new URL('/404', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * 아래와 같은 경로를 제외한 모든 요청 경로에서 미들웨어 실행:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
