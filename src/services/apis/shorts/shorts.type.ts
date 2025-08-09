import { SuccessResponse } from '@/services/config/dto';

// common
export interface BaseHalftimeDto {
	pk: number;
	videoUrl: string;
	usedIn: 'BOARD' | 'NEWS';
	referencePk: number; // 원본 글 pk
	title: string;
	viewCount: number;
	kickCount: number;
	createdAt: string;
}

// 오늘의 하프타임 조회
export type GetTodaysHalftimeResponse = SuccessResponse<BaseHalftimeDto[]>;
