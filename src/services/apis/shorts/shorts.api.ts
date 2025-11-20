import { fetcher } from '@/lib/server/fetcher';
import {
	GetHalftimeDetailResponse,
	GetHalftimeListRequest,
	GetHalftimeListResponse,
	GetTodaysHalftimeResponse,
	HalftimeSortType,
} from './shorts.type';
import { appendParams } from '@/lib/server/appendParams';

// 하프타임 리스트 조회
export const getHalftimeList = async (req: GetHalftimeListRequest) => {
	const params = new URLSearchParams();
	appendParams(params, req);

	const response = await fetcher<GetHalftimeListResponse>({ method: 'GET', url: `/api/shorts?${params.toString()}` });
	return response;
};

// 하프타임 상세 조회
export const getHalftimeDetail = async (pk: number, sort?: HalftimeSortType) => {
	const response = await fetcher<GetHalftimeDetailResponse>({
		method: 'GET',
		url: `/api/shorts/${pk}?sort=${sort || 'CREATED_DESC'}`,
	});

	return response;
};

// 오늘의 하프타임 조회
export const getTodaysHalftime = async () => {
	const response = await fetcher<GetTodaysHalftimeResponse>({ method: 'GET', url: `/api/shorts/fixed` });
	return response;
};
