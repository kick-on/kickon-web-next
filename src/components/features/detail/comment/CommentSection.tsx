'use client';

import { useState } from 'react';
import CommentInput from '@/components/features/detail/comment/CommentInput';
import CommentItem from '@/components/features/detail/comment/CommentItem';
import { postCommentKick } from '@/services/apis/detail/comment';

const CommentSection = ({ allowComments, isOurTeamNews, comments }) => {
	const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({});
	const [replyingTo, setReplyingTo] = useState<string[]>([]);
	const [replyVisibilities, setReplyVisibilities] = useState<{ [key: string]: boolean }>({});

	const toggleCommentLike = async (commentId: number) => {
		console.log({ reply: commentId });
		try {
			await postCommentKick(commentId, true);
			setLikedComments((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
		} catch (error) {
			console.error('Failed to kick comment:', error);
		}
	};

	const toggleReplyInputVisibility = (commentId: string) => {
		setReplyingTo((prev) => (prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]));
	};

	const toggleReplyListVisibility = (commentId: string) => {
		setReplyVisibilities((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
	};

	const commentItemProps = {
		likedComments,
		handleLikeToggle: toggleCommentLike,
		handleReply: toggleReplyInputVisibility,
		toggleReplyVisibility: toggleReplyListVisibility,
		replyingTo,
		replyVisibilities,
		isOurTeamNews,
	};

	const totalComments = Array.isArray(comments)
		? comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length ?? 0), 0)
		: 0;

	return (
		<div className="px-4">
			{allowComments && isOurTeamNews && <CommentInput />}
			<p className="body5-regular -mx-4 text-black-600 border-t border-b border-black-300 px-4 py-3">
				댓글 <span className="text-black-900">{totalComments}</span>개
			</p>
			<div className="flex flex-col pr-2">
				{comments.map((comment) => (
					<div key={comment.pk}>
						<CommentItem content={comment} {...commentItemProps} parentNickname={comment.user.nickname} />
						{replyVisibilities[comment.pk] &&
							comment.replies?.map((reply) => (
								<CommentItem
									key={`${comment.pk}-${reply.pk}`}
									content={reply}
									{...commentItemProps}
									isReply
									parentNickname={comment.user.nickname}
								/>
							))}
					</div>
				))}
			</div>
		</div>
	);
};

export default CommentSection;
