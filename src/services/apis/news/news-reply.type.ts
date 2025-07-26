import { SuccessResponse } from '@/services/config/dto';
import { CommonCommentDto, CommonCreateNewReply } from '../common/types';

// 뉴스 댓글 조회 응답
export type GetNewsCommentsResponse = SuccessResponse<CommonCommentDto[]>;

// 댓글 킥 요청
export interface PostNewsCommentKickRequest {
	reply: number; // 댓글 PK값
}

// 새로운 댓글 생성 요청
export interface createNewsReplyRequest extends CommonCreateNewReply {
	news: string;
}
