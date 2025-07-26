import { SuccessResponse } from '@/services/config/dto';
import { TeamDto } from '../team/dto';
import { UserDto } from '@/services/apis/user/dto';

// 게시글 리스트 조회
export interface GetBoardListRequest {
	team?: number;
	size: number;
	page: number;
	order: string;
	infinite?: boolean;
	lastBoard?: number;
	lastViewCount?: number;
}

export type GetBoardListResponse = SuccessResponse<BoardItemDto[]>;

// 함께 볼 만한 게시글 조회
export type GetRecommendedBoardsResponse = SuccessResponse<RecommendedBoardDto[]>;

// 내부 DTO
export interface RecommendedBoardDto {
	pk: number;
	title: string;
	user: UserDto;
	team: TeamDto;
	createdAt: string;
	views: number;
	likes: number;
	replies: number;
	isPinned: boolean;
}

export interface BoardItemDto {
	pk: number;
	title: string;
	user: UserDto;
	team: TeamDto;
	createdAt: string;
	hasImage?: boolean;
	views: number;
	likes: number;
	replies: number;
	isInfluencer: boolean; // 인플루언서 글인지 아닌지
	isPinned: boolean; // 이 글이 고정인지 아닌지
}
