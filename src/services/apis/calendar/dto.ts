import { SuccessResponse } from '@/services/config/dto';

// 매치 ON

// 해당 월에 진행되는 경기 일정 조회 응답
export interface MatchDate {
	date: string;
	count: number;
}

export interface MonthlyMatches {
	dates: MatchDate[];
}

export type GetMonthlyMatchesResponse = SuccessResponse<MonthlyMatches>;

// 승부 예측 가능 open 기간
export interface PredictionOpenPeriod {
	startDate: string;
	endDate: string;
	weeks: number;
}

export type GetPredictionOpenPeriodResponse = SuccessResponse<PredictionOpenPeriod>;

// 가장 가까운 경기 날짜 조회
export interface NextGameDate {
	nextDate: string;
}

export type GetNextMatchDateResponse = SuccessResponse<NextGameDate>;
// 승부 예측 결과

// 내가 참여한 승부 예측 경기 날짜 조회 응답
export interface PredictionDatesDto {
	dates: string[];
}

// 뉴스 상세 조회 응답 타입
export type GetPredictionDatesResponse = SuccessResponse<PredictionDatesDto>;
