import { fetcher } from '@/lib/server/fetcher';
import {
	GetMonthlyMatchesResponse,
	GetNextMatchDateResponse,
	GetPredictionDatesResponse,
	GetPredictionOpenPeriodResponse,
} from './dto';

// 매치 ON

// 해당 월에 진행되는 경기 일정 조회 api
export const getMonthlyMatchList = async (month: string): Promise<GetMonthlyMatchesResponse | null> => {
	try {
		const response = await fetcher<GetMonthlyMatchesResponse>({
			method: 'GET',
			url: `/api/game/calendar?&month=${month}`,
		});

		if (!response) {
			console.error('경기 일정 조회 실패 - 응답 없음');
			throw new Error('경기 일정 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('경기 일정 조회 실패:', error);
		throw error;
	}
};

// 승부 예측 가능 기간 조회 api
export const getPredictionOpenPeriod = async (): Promise<GetPredictionOpenPeriodResponse | null> => {
	try {
		const response = await fetcher<GetPredictionOpenPeriodResponse>({
			method: 'GET',
			url: `/api/game/predict/open`,
		});

		if (!response) {
			console.error('승부 예측 가능 기간 조회 실패 - 응답 없음');
			throw new Error('승부 예측 가능 기간 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('승부 예측 가능 기간 조회 실패:', error);
		throw error;
	}
};

// 가장 가까운 예정 경기 날짜 조회 api
export const getNextMatchDate = async (todayStr: string): Promise<GetNextMatchDateResponse | null> => {
	try {
		const response = await fetcher<GetNextMatchDateResponse>({
			method: 'GET',
			url: `/api/game/calendar/next?after=${todayStr}`,
		});

		if (!response) {
			console.error('가장 가까운 예정 경기 날짜 조회 실패 - 응답 없음');
			throw new Error('가장 가까운 예정 경기 날짜  조회 실패');
		}

		return response;
	} catch (error) {
		console.error('가장 가까운 예정 경기 날짜  조회 실패:', error);
		throw error;
	}
};

// 승부 예측

// 내가 참여한 승부 예측 경기 날짜 조회 api (캘린더 점찍기 용) TODO: 이름 수정 필요
export const getMyPredictionDates = async (): Promise<GetPredictionDatesResponse | null> => {
	try {
		const response = await fetcher<GetPredictionDatesResponse>({ method: 'GET', url: '/api/game/my-calendar' });

		if (!response) {
			console.error('내 캘린더 조회 실패 - 응답 없음');
			throw new Error('내 캘린더 조회 실패');
		}

		return response;
	} catch (error) {
		console.error('내 캘린더 조회 실패:', error);
		throw error;
	}
};
