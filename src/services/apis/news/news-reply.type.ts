import { SuccessResponse } from '@/services/config/dto';
import { CommonCommentDto, CommonCreateNewReplyDto } from '../common/types';

// 뉴스 댓글 조회 응답
export type GetNewsCommentsResponse = SuccessResponse<CommonCommentDto[]>;

// 새로운 댓글 생성 요청
export interface createNewsReplyRequest extends CommonCreateNewReplyDto {
	news: number;
}
