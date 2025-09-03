import { SuccessResponse } from '@/services/config/dto';
import { CommonCommentDto, CommonCreateNewReplyDto } from '../common/types';

// 게시글 댓글 조회 응답
export type GetBoardCommentsResponse = SuccessResponse<CommonCommentDto[]>;

// 댓글 킥 요청
export interface CreateNewsCommentKickRequest {
	reply: number; // 댓글 PK값
}

// 새로운 댓글 생성 요청
export interface CreateBoardReplyRequest extends CommonCreateNewReplyDto {
	board: number;
}
