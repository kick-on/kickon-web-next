import { SuccessResponse } from '@/services/config/dto';

// 오늘의 하프타임 조회
export interface GetTodaysHalftimeDto {
	s3Key: string;
	usedIn: 'BOARD' | 'NEWS';
	referencePk: number;
	title: string;
	viewCount: number;
	kickCount: number;
}
export type GetTodaysHalftimeResponse = SuccessResponse<GetTodaysHalftimeDto[]>;
