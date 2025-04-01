'use client';

import { useEffect, useState } from 'react';
import CommentInput from '@/components/features/detail/comment/CommentInput';
import CommentItem from '@/components/features/detail/comment/CommentItem';
import { postCommentKick } from '@/services/apis/detail/comment';
//import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

//teampK 받아야됨
const CommentSection = ({ type, comments, contentsId }) => {
	const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({});
	const [replyingTo, setReplyingTo] = useState<string[]>([]);
	const [replyVisibilities, setReplyVisibilities] = useState<{ [key: string]: boolean }>({});
	const isNews = type === 'news';
	const isOurTeamPost = true;
	useEffect(() => {
		const storedLikes = localStorage.getItem('likedComments');
		if (storedLikes) {
			setLikedComments(JSON.parse(storedLikes));
		}
	}, []);

	const toggleCommentLike = async (commentId: number) => {
		const result = await postCommentKick(commentId, isNews);
		console.log('결과', result);
		const updatedLikes = { ...likedComments, [commentId]: !likedComments[commentId] };
		setLikedComments(updatedLikes);
		localStorage.setItem('likedComments', JSON.stringify(updatedLikes));
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

	const totalComments = Array.isArray(comments)
		? comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length ?? 0), 0)
		: 0;

	return (
		<div className="px-4 mb-12">
			{isOurTeamPost && <CommentInput contentType={type} contentsId={contentsId} />}
			<p className="body5-regular -mx-4 text-black-600 border-t border-b border-black-300 px-4 py-3">
				댓글 <span className="text-black-900">{totalComments}</span>개
			</p>
			<div className="flex flex-col pr-2">
				{totalComments === 0 ? (
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
		</div>
	);
};

export default CommentSection;
// const { currentUserInfo } = useCurrentUserInfoStore.getState();
// console.log('내 정보', currentUserInfo?.id);
// const isOurTeamPost = !!teamPk && !!currentUserInfo?.teamPk && teamPk === currentUserInfo.teamPk;
