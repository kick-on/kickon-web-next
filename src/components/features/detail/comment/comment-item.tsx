import Image from 'next/image';
import { useMemo } from 'react';
import clsx from 'clsx';
import CommentInput from './comment-input';
import { CommentItemProps } from '@/services/apis/detail/comment/dto';
import { formatStringToDate } from '@/lib/utils/formatStringToDate';

function CommentItem({
	content,
	type,
	likedComments,
	handleLikeToggle,
	handleReply,
	toggleReplyVisibility,
	replyingTo,
	replyVisibilities,
	isCommentAllowed,
	contentsId,
	parentReply,
	isReply = false,
	onCommentSubmit,
}: CommentItemProps) {
	const isRepliesOpen = useMemo(() => {
		return !isReply && Array.isArray(content.replies) && content.replies.length > 0;
	}, [content.replies, isReply]);

	const isReplyInputOpen = useMemo(() => replyingTo.includes(content.pk), [replyingTo, content.pk]);
	return (
		<>
			<div className={clsx('flex items-start mt-5 pb-3.5', isReply && 'pl-10')}>
				<Image
					src={content.user?.profileImageUrl ?? '/default-profile.svg'}
					alt="프로필"
					width={24}
					height={24}
					className="w-6 h-6 rounded-full mr-[0.625rem] object-cover"
				/>

				<div className="flex flex-col flex-1">
					<div className="flex justify-between items-center mb-0.5">
						<div className="flex items-center gap-4">
							<span className="body5-medium text-black-900">{content.user.nickname}</span>
							<span className="body6-regular text-black-600">
								{formatStringToDate(content.createdAt, '2-digit', true)}
							</span>
						</div>
						<button onClick={() => handleLikeToggle(content.pk)} className="flex items-center gap-1">
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

					<p className="body5-regular text-black-900 mt-3 mb-3.5">
						{isReply && <span className="text-[#890f0e] mr-1">@{parentReply}</span>}
						{content.contents}
					</p>

					<div className="flex flex-col gap-3.5">
						{isCommentAllowed && !isReply && (
							<button
								className="button5-regular text-black-700 bg-black-200 rounded-sm px-2 py-1 w-fit"
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

					{isReplyInputOpen && (
						<CommentInput
							type="reply"
							contentsId={contentsId}
							parentReplyId={content.pk}
							contentType={type}
							mentionNickname={content.user.nickname}
							onCommentSubmit={(isReply) => onCommentSubmit(isReply, content.pk)}
						/>
					)}
				</div>
			</div>
			<hr className="border-t border-black-300 -mx-6 -ml-4" />
		</>
	);
}

export default CommentItem;
