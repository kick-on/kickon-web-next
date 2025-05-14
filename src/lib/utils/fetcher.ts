import { ProxyParameter } from '@/app/api/proxy/route';

// proxy 경로로 라우팅하는 함수
export async function fetcher<T>(body: ProxyParameter, revalidate?: number) {
	const response = await fetch('/api/proxy', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
		next: { revalidate: revalidate ?? 0 }, // revalidate를 안 넘기면 캐싱 안 함
	});

	if (!response.ok) {
		throw new Error(`proxy 호출 실패: ${response.status}`);
	}

	const data: T = await response.json();
	return data;
}
