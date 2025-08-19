import { SuccessResponse } from '@/services/config/dto';
import { UserDto } from '../user/dto';

// enum
export type HalftimeSortType = 'CREATED_DESC' | 'POPULAR' | 'CREATED_ASC';

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

// 하프타임 리스트 조회
export interface GetHalftimeListRequest {
	sort: HalftimeSortType;
	page: number;
	size: number;
}
export type GetHalftimeListResponse = SuccessResponse<BaseHalftimeDto[]>;

// 하프타임 디테일 조회
export interface GetHalftimeDetailDto extends BaseHalftimeDto {
	replyCount: number;
	user: UserDto;
	isKicked: boolean;
}
export type GetHalftimeDetailResponse = SuccessResponse<GetHalftimeDetailDto>;

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
