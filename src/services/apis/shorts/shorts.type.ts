import { SuccessResponse } from '@/services/config/dto';

// 오늘의 하프타임 조회
export interface GetTodaysHalftimeDto {
	pk: number;
	videoUrl: string;
	usedIn: 'BOARD' | 'NEWS';
	referencePk: number; // 원본 글 pk
	title: string;
	viewCount: number;
	kickCount: number;
	createdAt: string;
}
export type GetTodaysHalftimeResponse = SuccessResponse<GetTodaysHalftimeDto[]>;
