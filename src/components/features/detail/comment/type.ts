import { CommentDto } from '@/services/apis/detail/comment/dto';

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
	closeReplyInput: (commentId: number) => void;
	toggleReplyVisibility: (commentId: number) => void;
	replyingTo: number[];
	replyVisibilities: Record<number, boolean>;
	isCommentAllowed: boolean;
	contentsId: number;
	parentReply?: string;
	isReply?: boolean;
	onCommentSubmit: (isReply: boolean, pk?: number) => void;
	onEditSubmit: (isReply: boolean, pk?: number) => void;
	editingCommentId?: number;
	setEditingCommentId?: (id: number | null) => void;
}

// 코멘트 입력 props
export interface CommentInputProps {
	type?: 'comment' | 'reply' | 'edit';
	mentionNickname?: string;
	parentReplyId?: number;
	contentType: 'news' | 'board';
	defaultContent?: string;
	contentsId: number;
	onCommentSubmit?: (isReply: boolean) => void;
	onCommentCancel?: () => void;
}
