import { SERVER_URL } from '@/services/config/constants';
import useAuthStore from '../store/useAuthStore';

export interface FetcherParams {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	url: string;
	headers?: Record<string, string>;
	body?: Record<string, any>;
}

export async function fetcher<T>({ url, method, headers, body }: FetcherParams, revalidate?: number) {
	const hasBody = !!body;

	// api 호출
	async function performRequest(token?: string) {
		return fetch(`${SERVER_URL}${url}`, {
			method,
			headers: {
				...(token ? { Authorization: `Bearer ${token}` } : {}),
				...(hasBody ? { 'Content-Type': 'application/json' } : {}),
				...headers,
			},
			body: hasBody ? JSON.stringify(body) : undefined,
			next: { revalidate: revalidate ?? 0 }, // revalidate를 안 넘기면 캐싱 안 함
		});
	}

	// 인증 에러 시 토큰 재발급
	async function refreshAccessToken(): Promise<string | null> {
		try {
			const response = await fetch('/api/auth/refresh', {
				method: 'POST',
				credentials: 'include',
			});
			if (!response.ok) return null;

			const json = (await response.json()) as { accessToken?: string };
			const newToken = json?.accessToken ?? null;
			if (newToken) {
				useAuthStore.getState().setToken(newToken);
			}
			return newToken ?? null;
		} catch {
			return null;
		}
	}

	// 1차 요청 (현재 보유한 access token 사용)
	const initialToken = useAuthStore.getState().accessToken ?? undefined;
	let response = await performRequest(initialToken);

	if (response.status === 401 || response.status === 403) {
		const newToken = await refreshAccessToken();
		if (newToken) {
			// 2차 요청 (재발급한 access token 사용)
			response = await performRequest(newToken);
		}
	}

	const data: T = await response.json();
	return data;
}
