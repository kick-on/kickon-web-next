import { SuccessResponse } from '@/services/config/dto';
import { CommonCreatePostRequest, CommonPostDetailDto, CommonPostListDto } from '../common/types';

// Common
export interface BoardListDto extends CommonPostListDto {
	hasImage: boolean;
	isPinned: boolean;
}
export interface BoardDetailDto extends CommonPostDetailDto {
	hasImage: boolean;
	isPinned: boolean;
	isInfluencer: boolean;
}

// 게시글 리스트 조회
export interface GetBoardListRequest {
	team?: number;
	size: number;
	page: number;
	order: string;
	// 무한 스크롤
	infinite?: boolean;
	lastBoard?: number;
	lastViewCount?: number;
}
export type GetBoardListResponse = SuccessResponse<BoardListDto[]>;

// 게시글 상세 조회
export interface GetBoardDetailDto extends BoardDetailDto {
	isInfluencer: boolean;
}
export type GetBoardDetailResponse = SuccessResponse<GetBoardDetailDto>;

// 게시글 생성
export interface CreateBoardRequest extends CommonCreatePostRequest {
	hasImage: boolean;
	isPinned: boolean;
}
export type CreateBoardResponse = SuccessResponse<BoardDetailDto>;

// 게시글 수정
export type PatchBoardDetailRequest = Partial<CreateBoardRequest>;

// 함께 볼 만한 게시글 조회
export type GetRecommendedBoardResponse = SuccessResponse<BoardListDto[]>;
