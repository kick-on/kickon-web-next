import { fetcher } from '@/lib/server/fetcher';
import { GetDetailResponse, GetHotNewsResponse, GetNewsListRequest, GetNewsListResponse } from './news.type';
import { SERVER_URL } from '@/services/config/constants';
import { FailResponse } from '@/services/config/dto';

// 뉴스 상세 조회
export const getNewsDetailContent = async (id: number): Promise<GetDetailResponse | null> => {
	try {
		const response = await fetcher<GetDetailResponse>({ method: 'GET', url: `/api/news/${id}` });

		if (!response) {
			console.error('상세페이지 조회 실패 - 응답 없음');
			throw new Error('상세페이지 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('상세페이지 조회 실패:', error);
		throw error;
	}
};

// 뉴스 리스트 조회
export const getNewsList = async ({
	team,
	size,
	page,
	order,
	league,
	infinite,
	lastNews,
	lastViewCount,
}: GetNewsListRequest) => {
	const params = new URLSearchParams();

	params.append('order', String(order));
	params.append('size', String(size));
	params.append('page', String(page));

	if (team !== undefined) params.append('team', String(team));
	if (league !== undefined) params.append('league', String(league));
	// 무한 스크롤
	if (infinite !== undefined) params.append('infinite', String(infinite));
	if (lastNews !== undefined) params.append('lastNews', String(lastNews));
	if (lastViewCount !== undefined) params.append('lastViewCount', String(lastViewCount));

	try {
		const response = await fetcher<GetNewsListResponse | FailResponse>({
			method: 'GET',
			url: `/api/news?${params.toString()}`,
		});

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error('뉴스 리스트 조회 실패: ', `${SERVER_URL}/api/news?${params.toString()}`, response);
			return null;
		}

		return response;
	} catch (error) {
		console.error('뉴스 리스트 조회 실패: ', `${SERVER_URL}/api/news?${params.toString()}`, error);
	}
};

// top5 뉴스 조회
export const getHotNews = async (): Promise<GetHotNewsResponse | null> => {
	try {
		const response = await fetch(`${SERVER_URL}/api/news/hot`);

		if (!response.ok) {
			let errorPayload: unknown;
			try {
				errorPayload = await response.json();
			} catch (error) {
				errorPayload = error; // response가 json이 아닌 경우 방어
			}
			console.error('TOP5 뉴스 조회 실패:', errorPayload);
			return null;
		}
		return response.json();
	} catch (error) {
		console.error('TOP5 FETCH 자체 실패: ', error);
		return null;
	}
};
