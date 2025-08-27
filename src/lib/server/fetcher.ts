import { SERVER_URL } from '@/services/config/constants';
import useAuthStore from '../store/useAuthStore';

export interface FetcherParams {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	url: string;
	headers?: Record<string, string>;
	body?: Record<string, any>;
}

export async function fetcher<T>({ url, method, headers, body }: FetcherParams, revalidate?: number) {
	const { accessToken } = useAuthStore.getState();
	const hasBody = !!body;

	const response = await fetch(`${SERVER_URL}${url}`, {
		method,
		headers: {
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...(hasBody ? { 'Content-Type': 'application/json' } : {}),
			...headers,
		},
		body: hasBody ? JSON.stringify(body) : undefined,
		next: { revalidate: revalidate ?? 0 }, // revalidate를 안 넘기면 캐싱 안 함
	});

	const data: T = await response.json();
	return data;
}
