import { SuccessResponse } from '@/services/config/dto';

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

// 댓글 킥 요청
export interface PostCommentKickRequest {
	reply: number; // 댓글 PK값
}

// 새로운 댓글 생성 요청
export interface createNewReplyRequest {
	news: number;
	parentReply?: number;
	contents: string;
}

// 댓글 조회 응답
export type GetCommentsResponse = SuccessResponse<CommentDto[]>;
