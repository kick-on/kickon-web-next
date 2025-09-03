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
	replyTo?: { pk: number; nickname: string };
	editingCommentId?: number;
	setEditingCommentId?: (id: number | null) => void;
	setComments: Dispatch<SetStateAction<CommonCommentDto[]>>;
	setTotalReplies: (count: number) => void;
}

// 코멘트 입력 props
export interface CommentInputProps {
	type?: 'comment' | 'reply' | 'edit';
	replyTo?: {
		pk: number;
		nickname: string;
	};
	contentType: 'news' | 'board';
	contentsId: number;
	editingCommentId: number;
	defaultContent?: string;
	onCommentSubmit?: () => void;
	onCommentCancel?: () => void;
}
