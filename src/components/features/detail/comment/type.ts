import { CommonCommentDto } from '@/services/apis/common/types';
import { Dispatch, SetStateAction } from 'react';

// comment section props
export interface CommentSectionProps {
	postType: 'news' | 'board';
	postId: number;
	isCommentAllowed: boolean;
	totalreplies?: number;
}

// comment item props
export interface CommentItemProps {
	postType: 'news' | 'board';
	postId: number;
	comment: CommonCommentDto;
	isCommentAllowed: boolean;
	replyTo?: { pk: number; nickname: string };
	editingCommentId?: number;
	setEditingCommentId?: (id: number | null) => void;
}

// 코멘트 입력 props
export interface CommentInputProps {
	type?: 'comment' | 'reply' | 'edit';
	replyTo?: {
		pk: number;
		nickname: string;
	};
	postType: 'news' | 'board';
	postId: number;
	editingCommentId: number;
	defaultContent?: string;
	onCommentSubmit?: () => void;
	onCommentCancel?: () => void;
}
