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
	news?: number;
	board?: number;
	parentReply?: number;
	contents: string;
}

// 댓글 조회 응답
export type GetCommentsResponse = SuccessResponse<CommentDto[]>;

// comment section props
export interface CommentSectionProps {
	type: 'news' | 'board';
	isCommentAllowed: boolean;
	contentsId: number;
	totalreplies?: number;
	setTotalReplies?: (count: number) => void;
}

// comment item props
export interface CommentItemProps {
	content: CommentDto;
	type: 'news' | 'board';
	likedComments: Record<number, boolean>;
	handleLikeToggle: (commentId: number) => void;
	handleReply: (commentId: number) => void;
	toggleReplyVisibility: (commentId: number) => void;
	replyingTo: number[];
	replyVisibilities: Record<number, boolean>;
	isCommentAllowed: boolean;
	contentsId: number;
	parentReply?: string;
	isReply?: boolean;
	onCommentSubmit: () => void;
}

// 코멘트 입력 props
export interface CommentInputProps {
	type?: 'comment' | 'reply';
	mentionNickname?: string;
	parentReplyId?: number;
	contentType: 'news' | 'board';
	contentsId: number;
	onCommentSubmit?: () => void;
}
