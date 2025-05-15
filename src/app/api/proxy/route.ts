import callBackendApi from '@/lib/server/callBackendApi';
import { DOMAIN_URL } from '@/services/config/constants';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface ProxyParameter {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	url: string;
	headers?: Record<string, string>;
	body?: Record<string, string>;
}

export async function POST(req: Request) {
	const { method, url, headers, body }: ProxyParameter = await req.json();

	// 요청을 시도한 주소
	const requestOrigin = req.headers.get('origin');

	// origin이 비어있지 않고 (일부 ssr 등에서는 origin이 비어 있을 수 있음)
	// 해당 origin이 DOMAIN URL과 일치하지 않다면 (proxy를 통한 외부 공격 방어)
	if (requestOrigin && requestOrigin !== DOMAIN_URL) {
		return NextResponse.json({ message: 'Forbidden: invalid origin' }, { status: 403 });
	}

	const cookieStore = await cookies();
	const accessToken = cookieStore.get('accessToken')?.value;
	const refreshToken = cookieStore.get('refreshToken')?.value;

	return await callBackendApi({
		method,
		url,
		headers,
		body,
		accessToken,
		refreshToken,
	});
}
