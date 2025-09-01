import { CommonCommentDto } from '@/services/apis/common/types';
import { Dispatch, SetStateAction } from 'react';

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
	content: CommonCommentDto;
	type: 'news' | 'board';
	isCommentAllowed: boolean;
	contentsId: number;
	isReply?: boolean;
	replyTo?: { pk: number; nickname: string };
	editingCommentId?: number;
	setEditingCommentId?: (id: number | null) => void;
	setComments: Dispatch<SetStateAction<CommonCommentDto[]>>;
}

// 코멘트 입력 props
export interface CommentInputProps {
	type?: 'comment' | 'reply' | 'edit';
	mentionNickname?: string;
	parentReplyId?: number;
	editingCommentId: number;
	contentType: 'news' | 'board';
	defaultContent?: string;
	contentsId: number;
	onCommentSubmit?: (isReply: boolean) => void;
	onCommentCancel?: () => void;
}
