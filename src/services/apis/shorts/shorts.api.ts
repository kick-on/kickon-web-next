import { fetcher } from '@/lib/server/fetcher';
import { GetTodaysHalftimeResponse } from './shorts.type';

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
