import { SuccessResponse } from '@/services/config/dto';
import { UserDto } from '../user/dto';

// 뉴스 댓글 item
export interface NewsCommentDto {
	pk: number;
	contents: string;
	user: UserDto;
	createdAt: string;
	kickCount: number;
	replies: string[];
	kicked: boolean;
}

// 뉴스 댓글 조회 응답
export type GetNewsCommentsResponse = SuccessResponse<NewsCommentDto[]>;

// 댓글 킥 요청
export interface PostNewsCommentKickRequest {
	reply: number; // 댓글 PK값
}

// 새로운 댓글 생성 요청
export interface createNewsReplyRequest {
	news?: number;
	board?: number;
	parentReply?: number;
	contents: string;
}

// 댓글 수정 요청
export interface patchNewsReplyRequest {
	contents: string;
	usedImageKeys?: string[];
}
