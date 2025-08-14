import { fetcher } from '@/lib/server/fetcher';
import {
	GetHalftimeDetailResponse,
	GetHalftimeListRequest,
	GetHalftimeListResponse,
	GetTodaysHalftimeResponse,
} from './shorts.type';

// 하프타임 리스트 조회
export const getHalftimeList = async ({ sort, page, size }: GetHalftimeListRequest) => {
	try {
		const params = new URLSearchParams();

		params.append('sort', String(sort));
		params.append('size', String(size));
		params.append('page', String(page));

		const response = await fetcher<GetHalftimeListResponse>({ method: 'GET', url: `/api/shorts` });

		if (!response) {
			console.error('하프타임 리스트 조회 실패 - 응답 없음');
			throw new Error('하프타임 리스트 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('하프타임 리스트 조회 실패:', error);
		throw error;
	}
};

// 하프타임 상세 조회
export const getHalftimeDetail = async (pk: number) => {
	try {
		const response = await fetcher<GetHalftimeDetailResponse>({ method: 'GET', url: `/api/shorts/${pk}` });

		if (!response) {
			console.error('하프타임 상세 조회 실패 - 응답 없음');
			throw new Error('하프타임 상세 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('하프타임 상세 조회 실패:', error);
		throw error;
	}
};

// 오늘의 하프타임 조회
export const getTodaysHalftime = async () => {
	try {
		const response = await fetcher<GetTodaysHalftimeResponse>({ method: 'GET', url: `/api/shorts/fixed` });

		if (!response) {
			console.error('오늘의 하프타임 조회 실패 - 응답 없음');
			throw new Error('오늘의 하프타임 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('오늘의 하프타임 조회 실패:', error);
		throw error;
	}
};
