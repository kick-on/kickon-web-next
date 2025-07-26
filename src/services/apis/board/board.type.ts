import { SuccessResponse } from '@/services/config/dto';
import { CommonCreatePostRequest, CommonDetailDto } from '../common/types';

// Common
export interface BoardDto extends CommonDetailDto {
	hasImage: boolean;
	isPinned: boolean;
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
export type GetBoardListResponse = SuccessResponse<BoardDto[]>;

// 게시글 상세 조회
export type GetBoardDetailResponse = SuccessResponse<BoardDto>;

// 게시글 생성
export interface CreateBoardRequest extends CommonCreatePostRequest {
	hasImage: boolean;
	isPinned: boolean;
}
export type CreateBoardResponse = SuccessResponse<BoardDto>;

// 게시글 수정
export interface PatchBoardDetailRequest {
	board: number;
	reason: string;
}

// 함께 볼 만한 게시글 조회
export interface GetRecommendedBoardRequest {
	type?: 'all';
}
export type GetRecommendedBoardResponse = SuccessResponse<BoardDto[]>;
