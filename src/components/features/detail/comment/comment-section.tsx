'use client';

import { useEffect, useState } from 'react';
import CommentInput from '@/components/features/detail/comment/comment-input';
import CommentItem from '@/components/features/detail/comment/comment-item';
import { postCommentKick } from '@/services/apis/detail/comment';
import { getAccessToken, getRefreshToken } from '@/lib/utils/getAccessToken';
import LoginModal from '@/components/common/login-modal/login-modal';

const CommentSection = ({ type, comments, isOurTeamPost, contentsId, totalreplies }) => {
	const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({});
	const [replyingTo, setReplyingTo] = useState<string[]>([]);
	const [replyVisibilities, setReplyVisibilities] = useState<{ [key: string]: boolean }>({});
	const isNews = type === 'news';
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	useEffect(() => {
		const storedLikes = localStorage.getItem('likedComments');
		if (storedLikes) {
			setLikedComments(JSON.parse(storedLikes));
		}
	}, []);

	const toggleCommentLike = async (commentId: number) => {
		if (!getAccessToken() || !getRefreshToken()) {
			setIsLoginModalOpen(true);
			return;
		}

		const result = await postCommentKick(commentId, isNews);
		if (result) {
			setLikedComments((prev) => ({
				...prev,
				[commentId]: !prev[commentId],
			}));
			localStorage.setItem(
				'likedComments',
				JSON.stringify({ ...likedComments, [commentId]: !likedComments[commentId] }),
			);
		}
	};

	const toggleReplyInputVisibility = (commentId: string) => {
		setReplyingTo((prev) => (prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]));
	};

	const toggleReplyListVisibility = (commentId: string) => {
		setReplyVisibilities((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
	};

	const commentItemProps = {
		type,
		likedComments,
		handleLikeToggle: toggleCommentLike,
		handleReply: toggleReplyInputVisibility,
		toggleReplyVisibility: toggleReplyListVisibility,
		replyingTo,
		replyVisibilities,
		isOurTeamPost,
		contentsId,
	};

	return (
		<div className="px-4 mb-12">
			{isOurTeamPost && <CommentInput contentType={type} contentsId={contentsId} />}
			<p className="body5-regular -mx-4 text-black-600 border-t border-b border-black-300 px-4 py-3">
				댓글 <span className="text-black-900">{totalreplies}</span>개
			</p>
			<div className="flex flex-col pr-2">
				{totalreplies === 0 ? (
					<p className="text-center body5-regular text-black-500 py-10">댓글이 없습니다.</p>
				) : (
					<div className="flex flex-col pr-2">
						{comments.map((comment) => (
							<div key={comment.pk}>
								<CommentItem content={comment} {...commentItemProps} parentReply={comment.user.nickname} />
								{replyVisibilities[comment.pk] &&
									comment.replies?.map((reply) => (
										<CommentItem
											key={`${comment.pk}-${reply.pk}`}
											content={reply}
											{...commentItemProps}
											isReply
											parentReply={comment.user.nickname}
										/>
									))}
							</div>
						))}
					</div>
				)}
			</div>
			{isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
		</div>
	);
};

export default CommentSection;
