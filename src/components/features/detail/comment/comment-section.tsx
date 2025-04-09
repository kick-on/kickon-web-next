import { useCallback, useEffect, useState } from 'react';
import CommentInput from '@/components/features/detail/comment/comment-input';
import CommentItem from '@/components/features/detail/comment/comment-item';
import { getCommentList, postCommentKick } from '@/services/apis/detail/comment';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import PaginationBar from '@/components/common/pagination-bar.tsx/pagination-bar';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginModal from '@/components/common/login-modal/login-modal';
import { getAccessToken, getRefreshToken } from '@/lib/utils/getAccessToken';
import { CommentSectionProps } from '@/services/apis/detail/comment/dto';

function CommentSection({
	type,
	isCommentAllowed,
	contentsId,
	totalreplies = 0,
	setTotalReplies,
}: CommentSectionProps) {
	const router = useRouter();
	const isNews = type === 'news';

	const [comments, setComments] = useState([]);
	const [likedComments, setLikedComments] = useState({});
	const [replyingTo, setReplyingTo] = useState([]);
	const [replyVisibilities, setReplyVisibilities] = useState({});
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [hasError, setHasError] = useState(false);

	const searchParams = useSearchParams();
	const commentsPerPage = 10;
	const currentPage = Number(searchParams.get('page') || '1');
	const totalPages = Math.max(1, Math.ceil(totalreplies / commentsPerPage));
	const baseUrl = `/${type}/${contentsId}`;

	const fetchCommentsListData = useCallback(async () => {
		if (!contentsId || contentsId < 1) return;
		try {
			const response = await getCommentList(contentsId, currentPage, commentsPerPage, isNews);
			setComments(response?.data || []);
			setHasError(false);
		} catch (e) {
			console.error('댓글 불러오기 실패:', e);
			setHasError(true);
		}
	}, [contentsId, currentPage, isNews]);

	useEffect(() => {
		fetchCommentsListData();
	}, [fetchCommentsListData]);

	// 댓글 작성 시 해당 페이지로 이동하는 함수
	const handleCommentSubmit = async () => {
		const newTotalReplies = totalreplies + 1;
		const newTotalPages = Math.ceil(newTotalReplies / commentsPerPage);

		setTotalReplies?.(newTotalReplies);

		// 마지막 페이지로 이동
		if (newTotalPages !== currentPage) {
			router.push(`${baseUrl}?page=${newTotalPages}`, { scroll: false });
		} else {
			// 현재가 마지막 페이지면 그냥 새로 fetch
			await fetchCommentsListData();
		}
	};

	// 좋아요 상태 관리
	useEffect(() => {
		const storedLikes = localStorage.getItem('likedComments');
		if (storedLikes) {
			setLikedComments(JSON.parse(storedLikes));
		}
	}, []);

	const toggleCommentLike = async (commentId) => {
		if (!getAccessToken() || !getRefreshToken()) {
			setIsLoginModalOpen(true);
			return;
		}

		const result = await postCommentKick(commentId, isNews);
		if (result) {
			setLikedComments((prev) => {
				const updated = { ...prev, [commentId]: !prev[commentId] };
				localStorage.setItem('likedComments', JSON.stringify(updated));
				return updated;
			});

			setComments((prevComments) =>
				prevComments.map((comment) => {
					if (comment.pk === commentId) {
						const isLiked = likedComments[commentId] ?? false; // 이전 좋아요 상태
						const updatedKickCount = comment.kickCount + (isLiked ? -1 : 1); // 토글되므로 반대
						return { ...comment, kickCount: updatedKickCount };
					}
					return comment;
				}),
			);
		}
	};

	// 데이터 패칭 실패 시
	if (hasError) {
		return <FetchingFailedCard height="300px" marginTop="50px" onClick={() => window.location.reload()} />;
	}

	const commentItemProps = {
		type,
		likedComments,
		handleLikeToggle: toggleCommentLike,
		handleReply: (id) => setReplyingTo((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])),
		toggleReplyVisibility: (id) => setReplyVisibilities((prev) => ({ ...prev, [id]: !prev[id] })),
		replyingTo,
		replyVisibilities,
		isCommentAllowed,
		contentsId,
	};

	return (
		<div className="px-4 mb-10.5">
			{isCommentAllowed && (
				<CommentInput contentType={type} contentsId={contentsId} onCommentSubmit={handleCommentSubmit} />
			)}
			<p className="body5-regular -mx-4 text-black-600 border-t border-b border-black-300 px-4 py-3">
				댓글 <span className="text-black-900">{totalreplies}</span>개
			</p>

			{comments.length === 0 ? (
				<p className="text-center body5-regular text-black-500 py-10">댓글이 없습니다.</p>
			) : (
				<div className="flex flex-col pr-2">
					{comments.map((comment) => (
						<div key={comment.pk}>
							<CommentItem
								content={comment}
								{...commentItemProps}
								parentReply={comment.user.nickname}
								onCommentSubmit={handleCommentSubmit}
							/>
							{replyVisibilities[comment.pk] &&
								comment.replies?.map((reply) => (
									<CommentItem
										key={`${comment.pk}-${reply.pk}`}
										content={reply}
										{...commentItemProps}
										isReply
										parentReply={comment.user.nickname}
										onCommentSubmit={handleCommentSubmit}
									/>
								))}
						</div>
					))}
				</div>
			)}

			{totalPages > 1 && (
				<div className="flex justify-center mt-10">
					<PaginationBar totalPages={totalPages} baseUrl={baseUrl} />
				</div>
			)}
			{isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
		</div>
	);
}

export default CommentSection;
