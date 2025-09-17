'use client';

import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';
import CommentInput from './comment-input';
import { formatDate } from '@/lib/utils';
import { CommentItemProps } from './type';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { CommentMoreButton } from './comment-more-button';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { createNewsCommentKick, deleteNewsReply } from '@/services/apis/news/news-reply.api';
import { createBoardCommentKick, deleteBoardReply } from '@/services/apis/board/board-reply.api';
import AlertModal from '../alert-modal';
import { useIsLoginModalOpenStore } from '@/lib/store/useIsLoginModalOpenStore';

function CommentItem({
	postType,
	postId,
	comment,
	isCommentAllowed,
	replyTo,
	editingCommentId,
	setEditingCommentId,
	setComments,
	setTotalReplies,
}: CommentItemProps) {
	const { currentUserInfo } = useCurrentUserInfoStore();
	const { formattedDate, formattedTime } = formatDate(comment.createdAt, '2-digit');

	const isMobile = useIsMobile();

	const isNews = postType === 'news';
	const isReply = Boolean(replyTo);
	const isEditing = editingCommentId === comment.pk;
	const isMyComment = currentUserInfo?.id === comment.user.id;

	const [isReplyListOpen, setIsReplyListOpen] = useState(false);
	const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);

	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const { openLoginModal } = useIsLoginModalOpenStore();

	const handleCommentSubmit = async () => {
		if (isEditing) {
			setEditingCommentId(null);
		}

		if (isReplyInputOpen) {
			setIsReplyInputOpen(false);
			setIsReplyListOpen(true);

			// TODO: 댓글 리스트 업데이트 로직 추가
			// TODO: total comments 카운트 업데이트 로직 추가
		}
	};

	// 좋아요 토글 -> kicked가 서버한테 잘 오는지 판단하고 다시!! kickCount 이건 잘 돼!
	const toggleCommentLike = async (commentPk: number) => {
		if (!currentUserInfo) {
			openLoginModal();
			return;
		}

		const result = isNews ? await createNewsCommentKick(commentPk) : await createBoardCommentKick(commentPk);
		if (!result) return;

		setComments((prev) =>
			prev.map((c) => {
				if (c.pk !== commentPk) return c;
				const isCurrentlyLiked = c.kicked;
				return {
					...c,
					kicked: !isCurrentlyLiked,
					kickCount: c.kickCount + (isCurrentlyLiked ? -1 : 1), // 즉시 +1/-1 반영
				};
			}),
		);
	};

	const toggleReplyInputOpen = () => {
		if (isMobile) {
			// 모바일: 무조건 열기만
			setIsReplyInputOpen(true);
		} else {
			// PC: 토글
			setIsReplyInputOpen(!isReplyInputOpen);
		}
	};

	// 수정 모드로 진입
	const handleEnterEditMode = (commentPk: number) => {
		if (editingCommentId && editingCommentId !== commentPk) {
			setIsConfirmModalOpen(true);
			return;
		}
		setEditingCommentId(commentPk);
	};

	const handleDeleteComment = async (commentPk: number, parentCommentPk?: number) => {
		try {
			const response = isNews ? await deleteNewsReply(commentPk) : await deleteBoardReply(commentPk);
			if (response?.code === 'GET_SUCCESS') {
				if (isReply && parentCommentPk) {
					// 답글 삭제
					setComments((prev) =>
						prev.map((parentComment) =>
							parentComment.pk === parentCommentPk
								? {
										...parentComment,
										replies: parentComment.replies?.filter((reply) => reply.pk !== commentPk),
									}
								: parentComment,
						),
					);
				} else {
					// 댓글 삭제
					setComments((prev) => prev.filter((comment) => comment.pk !== commentPk));
				}

				// 만약 현재 수정 중이던 댓글을 삭제했다면, 수정 상태도 초기화
				if (editingCommentId === commentPk) {
					setEditingCommentId(null);
				}
			} else {
				console.error('댓글 삭제 실패', response);
			}
		} catch (error) {
			console.error('댓글 삭제 중 오류 발생', error);
		}
	};

	const commentItemProps: Omit<CommentItemProps, 'comment'> = {
		postType,
		isCommentAllowed,
		postId,
		editingCommentId,
		setEditingCommentId,
		setComments,
		setTotalReplies,
	};

	return (
		<div>
			<div
				className={clsx(
					'pr-6 pt-5 pb-3.5 flex items-start border-b border-black-200',
					isReply ? 'pl-[54px] bg-black-100' : 'pl-4',
				)}
			>
				<Image
					src={comment.user?.profileImageUrl || '/default-profile.svg'}
					alt="프로필"
					width={28}
					height={28}
					className="w-7 h-7 rounded-full mr-[0.625rem] object-cover"
				/>

				<div className="flex flex-col flex-1 relative">
					{/* 상단: 닉네임 + 날짜 + 더보기 */}
					<div className="flex justify-between items-start">
						<div className="flex items-center gap-4 mb-3">
							<span className="flex items-center gap-0.5 body5-medium text-black-900">
								{comment.user.nickname}
								{comment.user.isReporter && <Image width={12} height={12} src="/reporter-mark.svg" alt="구단 기자" />}
							</span>
							<span className="body6-regular text-black-600">
								{formattedDate}&nbsp;{formattedTime}
							</span>
						</div>

						{/* 더보기 버튼 (내 댓글일 때만)*/}
						{isMyComment && (
							<CommentMoreButton
								onDeleteClick={() => handleDeleteComment(comment.pk, replyTo?.pk)}
								onEditClick={() => {
									if (isReplyInputOpen) {
										if (window.confirm('작성 중인 내용이 사라집니다. 계속하시겠습니까?')) {
											setIsReplyInputOpen(false);
											handleEnterEditMode(comment.pk);
										}
									} else {
										handleEnterEditMode(comment.pk);
									}
								}}
							/>
						)}
					</div>

					{/* 본문 */}
					{!isEditing && (
						<div className="body5-regular text-black-900 mb-3.5 whitespace-pre-line">
							{isReply && replyTo && <span className="text-[#890f0e] mr-1">@{replyTo.nickname}</span>}
							{comment.contents}
						</div>
					)}

					<div className="flex justify-between">
						{/* 답글 입력 버튼 */}
						{isCommentAllowed && !isEditing && !isReply && !isReplyInputOpen && (
							<button
								className={clsx(
									'button5-regular rounded-sm px-2 py-1 mb-0.5 w-fit',
									isReplyInputOpen ? 'text-black-100 bg-black-500' : 'text-black-700 bg-black-200',
								)}
								onClick={toggleReplyInputOpen}
							>
								답글
							</button>
						)}

						{/* 킥 버튼 (하단 우측) */}
						{!isEditing && (
							<button onClick={() => toggleCommentLike(comment.pk)} className="ml-auto flex items-center gap-2">
								<Image src={comment.kicked ? '/kick/red.svg' : '/kick/gray.svg'} alt="kick" width={16} height={16} />
								<span className={comment.kicked ? 'text-black-900' : 'text-gray-500'}>{comment.kickCount}</span>
							</button>
						)}
					</div>

					{(isReplyInputOpen || isEditing) && (
						<CommentInput
							postType={postType}
							postId={postId}
							type={isEditing ? 'edit' : 'reply'}
							replyTo={isEditing ? replyTo : { pk: comment.pk, nickname: comment.user.nickname }}
							editingCommentId={editingCommentId}
							defaultContent={isEditing ? comment.contents : ''}
							onCommentSubmit={handleCommentSubmit}
							onCommentCancel={isEditing ? () => setEditingCommentId(null) : () => setIsReplyInputOpen(false)}
						/>
					)}

					{/* 답글 토글 */}
					{comment.replies?.length > 0 && (
						<button
							className="flex items-center gap-[0.625rem] text-black-600 body6-regular mt-3.5"
							onClick={() => setIsReplyListOpen(!isReplyListOpen)}
						>
							<Image
								src={isReplyListOpen ? '/chevron/score-up.svg' : '/chevron/score-down.svg'}
								alt="toggle replies"
								width={18}
								height={18}
							/>
							{isReplyListOpen ? '답글 숨기기' : `답글 ${comment.replies?.length}개`}
						</button>
					)}
				</div>
			</div>

			{isReplyListOpen &&
				comment.replies?.map((reply) => (
					<CommentItem
						key={reply.pk}
						comment={reply}
						replyTo={{ pk: comment.pk, nickname: comment.user.nickname }}
						{...commentItemProps}
					/>
				))}

			{isConfirmModalOpen && (
				<AlertModal
					type="confirm"
					description={`작성 중인 수정사항이 초기화됩니다.\n이 댓글을 수정하시겠습니까?`}
					onCancel={() => {
						setIsConfirmModalOpen(false);
					}}
					onConfirm={() => {
						setEditingCommentId(comment.pk);
						setIsConfirmModalOpen(false);
					}}
				/>
			)}
		</div>
	);
}

export default CommentItem;
