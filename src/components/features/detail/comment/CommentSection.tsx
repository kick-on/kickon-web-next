import CommentInput from '@/components/features/detail/comment/CommentInput';
import CommentItem from '@/components/features/detail/comment/CommentItem';

const CommentSection = ({ allowComments, isOurTeamNews, comments, commentItemProps }) => {
	const { replyVisible } = commentItemProps;
	const totalComments = comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length ?? 0), 0);

	return (
		<div className="px-4">
			{allowComments && isOurTeamNews && <CommentInput />}

			<p className="body5-regular -mx-4 text-black-600 border-t border-b border-black-300 px-4 py-3">
				댓글 <span className="text-black-900">{totalComments}</span>개
			</p>

			<div className="flex flex-col pr-2">
				{comments.map((comment) => (
					<div key={comment.pk}>
						<CommentItem content={comment} {...commentItemProps} />
						{replyVisible[comment.pk] &&
							comment.replies?.map((reply) => (
								<CommentItem key={`${comment.pk}-${reply.pk}`} content={reply} {...commentItemProps} isReply />
							))}
					</div>
				))}
			</div>
		</div>
	);
};

export default CommentSection;
