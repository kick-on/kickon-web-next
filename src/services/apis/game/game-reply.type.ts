import { UserDto } from '@/services/apis/user/user.type';
import { SuccessResponse } from '@/services/config/dto';

// 경기 별 댓글 리스트 조회
export interface GetGameCommentListRequest {
	game: number;
	size: number;
	page: number;
	infinite: boolean;
	lastReply: number;
}

export type GetGameCommentListResponse = SuccessResponse<GameCommentDto[]>;

// 경기 별 인기 댓글 조회
// 인기 댓글이 없는 경우 null
export type GetTopGameCommentResponse = SuccessResponse<GameCommentDto | null>;

// 경기 별 댓글 생성
export interface CreateGameCommentRequest {
	game: number;
	contents: string;
}

export type CreateGameCommentResponse = SuccessResponse<GameCommentDto>;

// 내부 dto
export interface GameCommentDto {
	pk: number;
	contents: string;
	user: UserDto;
	createdAt: string;
	kickCount: number;
	kicked: boolean;
}
