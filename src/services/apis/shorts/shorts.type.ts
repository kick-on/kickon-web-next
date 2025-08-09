import { SuccessResponse } from '@/services/config/dto';
import { UserDto } from '../user/dto';

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
	sort?: 'CREATED_DESC' | 'POPULAR' | 'CREATED_ASC';
	page: number;
	size: number;
}
export type GetHalftimeListResponse = SuccessResponse<BaseHalftimeDto[]>;

// 하프타임 디테일 조회
export interface GetHalftimeDetailDto extends BaseHalftimeDto {
	replyCount: number;
	user: UserDto;
}
export type GetHalftimeDetailResponse = SuccessResponse<GetHalftimeDetailDto[]>;
