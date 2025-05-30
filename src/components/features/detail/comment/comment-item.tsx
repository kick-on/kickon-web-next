'use client';

import Image from 'next/image';
import { useMemo, useRef } from 'react';
import clsx from 'clsx';
import CommentInput from './comment-input';
import { formatStringToDate } from '@/lib/utils/formatStringToDate';
import { CommentItemProps } from './type';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { CommentMoreButton } from './comment-more-button';
import useIsMobile from '@/lib/hooks/useIsMobile';

function CommentItem({
	content,
	type,
	likedComments,
	handleLikeToggle,
	handleReply,
	closeReplyInput,
	toggleReplyVisibility,
	replyingTo,
	replyVisibilities,
	isCommentAllowed,
	contentsId,
	parentReply,
	isReply = false,
	onCommentSubmit,
	onEditSubmit,
	editingCommentId,
	setEditingCommentId,
}: CommentItemProps) {
	const { currentUserInfo } = useCurrentUserInfoStore();
	const isMobile = useIsMobile();
	const isMyComment = currentUserInfo?.id === content.user.id;
	const isRepliesOpen = useMemo(() => {
		return !isReply && Array.isArray(content.replies) && content.replies.length > 0;
	}, [content.replies, isReply]);

	const isReplyInputOpen = useMemo(() => replyingTo.includes(content.pk), [replyingTo, content.pk]);
	const moreButtonRef = useRef(null);

	const isEditing = editingCommentId === content.pk;

	return (
		<div>
			<div
				className={clsx(
					'flex items-start mt-5 pb-3.5',
					isReply && 'pl-10',
					(isReplyInputOpen || isEditing) && (isMobile ? 'pb-30' : 'pb-15'),
				)}
			>
				<Image
					src={content.user?.profileImageUrl || '/default-profile.svg'}
					alt="프로필"
					width={24}
					height={24}
					className="w-6 h-6 rounded-full mr-[0.625rem] object-cover"
				/>

				<div className="flex flex-col flex-1 relative">
					{/* 상단: 닉네임 + 날짜 + 더보기 */}
					<div className="flex justify-between items-center mb-0.5">
						<div className="flex items-center gap-4">
							<span className="body5-medium text-black-900">{content.user.nickname}</span>
							<span className="body6-regular text-black-600">
								{formatStringToDate(content.createdAt, '2-digit', true)}
							</span>
						</div>

						{/* 더보기 버튼 (내 댓글일 때만)*/}
						{isMyComment && (
							<div ref={moreButtonRef} className="relative">
								<CommentMoreButton
									onEditClick={() => {
										setEditingCommentId(content.pk);
									}}
								/>
							</div>
						)}
					</div>
					{/* 본문 */}
					<p className="body5-regular text-black-900 mt-3 mb-3.5">
						{isReply && <span className="text-[#890f0e] mr-1">@{parentReply}</span>}
						{content.contents}
					</p>
					{/* 하단 영역: 답글 버튼, 답글 토글, 킥 버튼 */}
					<div className="flex justify-between items-center gap-3.5">
						<div className="flex flex-col gap-3.5">
							{isCommentAllowed && !isReply && !isReplyInputOpen && (
								<button
									className={clsx(
										'button5-regular rounded-sm px-2 py-1 mb-0.5 w-fit',
										isReplyInputOpen ? 'text-black-100 bg-black-500' : 'text-black-700 bg-black-200',
									)}
									onClick={() => handleReply(content.pk)}
								>
									답글
								</button>
							)}

							{isRepliesOpen && (
								<button
									className="flex items-center gap-[0.625rem] text-black-600 body6-regular"
									onClick={() => toggleReplyVisibility(content.pk)}
								>
									<Image
										src={replyVisibilities[content.pk] ? '/chevron/score-up.svg' : '/chevron/score-down.svg'}
										alt="toggle replies"
										width={16}
										height={16}
									/>
									{replyVisibilities[content.pk] ? '답글 숨기기' : `답글 ${content.replies.length}개`}
								</button>
							)}
						</div>

						{/* 킥 버튼 (하단 우측) */}
						<button onClick={() => handleLikeToggle(content.pk)} className="flex items-center gap-2">
							<Image
								src={likedComments[content.pk] ? '/kick/red.svg' : '/kick/gray.svg'}
								alt="kick"
								width={16}
								height={16}
							/>
							<span className={likedComments[content.pk] ? 'text-black-900' : 'text-gray-500'}>
								{content.kickCount + (likedComments[content.pk] && content.kickCount === 0 ? 1 : 0)}
							</span>
						</button>
					</div>

					{/* 댓글 입력창 */}
					{(isReplyInputOpen || isEditing) && (
						<CommentInput
							type={isEditing ? 'edit' : 'reply'}
							contentsId={contentsId}
							parentReplyId={isEditing ? undefined : content.pk}
							contentType={type}
							mentionNickname={isEditing ? undefined : content.user.nickname}
							defaultContent={isEditing ? content.contents : ''}
							onCommentSubmit={(isReply) => {
								if (isEditing) {
									onEditSubmit(content.pk, isReply);
								} else {
									onCommentSubmit(isReply, content.pk);
								}
							}}
							onCommentCancel={() => {
								if (isEditing) {
									setEditingCommentId(null);
									closeReplyInput(content.pk);
								} else {
									closeReplyInput(content.pk);
								}
							}}
						/>
					)}
				</div>
			</div>
			<hr className="border-t border-black-200 -mx-6 -ml-4" />
		</div>
	);
}

export default CommentItem;
