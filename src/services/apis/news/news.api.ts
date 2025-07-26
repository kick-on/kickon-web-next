import { fetcher } from '@/lib/server/fetcher';
import {
	GetNewsDetailResponse,
	GetHotNewsResponse,
	GetNewsListRequest,
	GetNewsListResponse,
	GetRecommendedNewsRequest,
	GetRecommendedNewsResponse,
	PatchNewsDetailRequest,
	CreateNewsRequest,
	CreateNewsResponse,
} from './news.type';
import { SERVER_URL } from '@/services/config/constants';
import { EmptySuccessResponse, FailResponse } from '@/services/config/dto';

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

// 뉴스 상세 조회
export const getNewsDetail = async (id: number): Promise<GetNewsDetailResponse | null> => {
	try {
		const response = await fetcher<GetNewsDetailResponse>({ method: 'GET', url: `/api/news/${id}` });

		if (!response) {
			console.error('뉴스 상세 조회 실패 - 응답 없음');
			throw new Error('뉴스 상세 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('뉴스 상세 조회 실패:', error);
		throw error;
	}
};

// 뉴스 생성
export async function createNews(data: CreateNewsRequest): Promise<CreateNewsResponse> {
	try {
		const response = await fetcher<CreateNewsResponse>({ method: 'POST', url: '/api/news', body: data });

		return response;
	} catch (error) {
		console.error('API 요청 실패:', error);
		throw error;
	}
}

// 뉴스 수정
export const patchNewsDetail = async (
	newsPk: number,
	requestBody: PatchNewsDetailRequest,
): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({
			method: 'PATCH',
			url: `/api/news/${newsPk}`,
			body: requestBody,
		});

		return response;
	} catch (error) {
		console.error('뉴스 수정 실패:', error);
		throw error;
	}
};

// 뉴스 삭제
export const deleteNewsDetail = async (newsPk: number): Promise<EmptySuccessResponse> => {
	try {
		const response = await fetcher<EmptySuccessResponse>({ method: 'DELETE', url: `/api/news/${newsPk}` });

		return response;
	} catch (error) {
		console.error('뉴스 삭제 실패:', error);
		throw error;
	}
};

// 함께 볼 만한 뉴스 조회
export const getRecommendedNews = async ({ type }: GetRecommendedNewsRequest) => {
	const params = new URLSearchParams();

	if (type !== undefined) params.append('type', type);

	const response = await fetcher<GetRecommendedNewsResponse | null>({
		method: 'GET',
		url: `/api/news/home?${params.toString()}`,
	});

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error(response);
		return null;
	}
	return response;
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
