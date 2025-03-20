import Image from 'next/image';
import CommentInput from './CommentInput';

const CommentItem = ({
	comment,
	likedComments,
	handleLikeToggle,
	handleReply,
	toggleReplyVisibility,
	replyingTo,
	isReply = false,
}) => {
	const isReplyOpen = replyingTo.includes(comment.pk); // 현재 댓글의 답글 입력창 상태
	const isRepliesVisible = !isReply && comment.replies.length > 0; // 대댓글이 존재하는 경우만 보이기
	return (
		<div className={`flex items-start mt-5 pb-3.5 border-b border-black-300 ${isReply ? 'pl-10' : ''}`}>
			<Image
				src={comment.user.profileImageUrl}
				alt="프로필"
				width={24}
				height={24}
				className="rounded-full mr-[10px]"
			/>

			<div className="flex flex-col flex-1">
				<div className="flex justify-between items-center mb-0.5">
					<div className="flex items-center gap-4">
						<span className="body5-medium text-black-900">{comment.user.nickname}</span>
						<span className="body6-regular text-black-600">{new Date(comment.createdAt).toLocaleDateString()}</span>
					</div>
					<button onClick={() => handleLikeToggle(comment.pk)} className="flex items-center gap-1">
						<Image
							src={likedComments[comment.pk] ? '/kick/red.svg' : '/kick/gray.svg'}
							alt="kick"
							width={16}
							height={16}
						/>
						<span className={likedComments[comment.pk] ? 'text-black-900' : 'text-gray-500'}>
							{comment.kickCount + (likedComments[comment.pk] ? 1 : 0)}
						</span>
					</button>
				</div>

				<p className="body5-regular text-black-900 mt-3 mb-3.5">{comment.contents}</p>

				<div className="flex flex-col gap-3.5">
					<button
						className="button5-regular text-black-700 bg-black-200 rounded-sm px-2 py-1 w-fit"
						onClick={() => handleReply(comment.pk)}
					>
						답글
					</button>

					{isRepliesVisible && (
						<button
							className="flex justify-start text-black-600 body6-regular"
							onClick={() => toggleReplyVisibility(comment.pk)}
						>
							{replyingTo.includes(comment.pk) ? '답글 숨기기' : `답글 ${comment.replies.length}개`}
						</button>
					)}
				</div>

				{isReplyOpen && <CommentInput type="reply" />}
			</div>
		</div>
	);
};

export default CommentItem;
