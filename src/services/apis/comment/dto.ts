import { SuccessResponse } from '../../config/dto';

export interface UserDto {
	id: string;
	nickname: string;
	profileImageUrl: string;
}

export interface CommentDto {
	pk: number;
	contents: string;
	user: UserDto;
	createdAt: string;
	kickCount: number;
	replies: string[];
	kicked: boolean;
}

// 댓글 조회 응답
export type GetCommentsResponse = SuccessResponse<CommentDto[]>;
