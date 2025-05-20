'use client';

import { useCallback, useEffect, useState } from 'react';
import CommentInput from './comment-input';
import CommentItem from './comment-item';
import { getCommentList, postCommentKick } from '@/services/apis/detail/comment';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import PaginationBar from '@/components/common/pagination-bar';
import { useSearchParams } from 'next/navigation';
import LoginModal from '@/components/common/login-modal/login-modal';
import useIsMobile from '@/lib/hooks/useIsMobile';
import Image from 'next/image';
import { CommentSectionProps } from './type';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

function CommentSection({
	type,
	isCommentAllowed,
	contentsId,
	totalreplies = 0,
	setTotalReplies,
}: CommentSectionProps) {
	const currentUserInfo = useCurrentUserInfoStore();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const isNews = type === 'news';
	const baseUrl = `/${type}/${contentsId}`;

	const [comments, setComments] = useState([]);
	const [likedComments, setLikedComments] = useState({});
	const [replyingTo, setReplyingTo] = useState([]);
	const [replyVisibilities, setReplyVisibilities] = useState({});
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const [isLastPageLoaded, setIsLastPageLoaded] = useState(false);
	// 로드된 페이지들을 추적하는 상태 추가
	const [loadedPages, setLoadedPages] = useState([1]);

	// 현재 페이지 추출
	const pageParam = searchParams.get('page');
	const [currentPage, setCurrentPage] = useState(pageParam ? Number(pageParam) : 1);

	const commentsPerPage = 10;

	const fetchComments = useCallback(
		async (page: number, append = false) => {
			if (!contentsId || contentsId < 1) return;
			try {
				const response = await getCommentList(contentsId, page, commentsPerPage, isNews);

				if (append) {
					// 중복되지 않는 새 댓글만 추가
					setComments((prev) => {
						const newComments = response?.data?.filter((c) => !prev.find((p) => p.pk === c.pk)) || [];
						return [...prev, ...newComments];
					});
				} else {
					setComments(response?.data || []);
				}
				setTotalPages(response.meta?.totalPages || 1);
				setHasError(false);
				return response;
			} catch {
				setHasError(true);
				return null;
			}
		},
		[contentsId, isNews],
	);

	// 모든 로드된 페이지의 댓글을 다시 불러오는 함수
	const reloadAllLoadedComments = useCallback(async () => {
		if (isMobile && loadedPages.length > 0) {
			let allComments = [];

			// 모든 로드된 페이지를 순서대로 불러옴
			for (const page of loadedPages.sort((a, b) => a - b)) {
				const response = await getCommentList(contentsId, page, commentsPerPage, isNews);
				if (response?.data) {
					// 중복 제거하면서 댓글 추가
					const newComments = response.data.filter((c) => !allComments.find((existing) => existing.pk === c.pk));
					allComments = [...allComments, ...newComments];
				}
			}

			setComments(allComments);
			return true;
		}
		return false;
	}, [loadedPages, contentsId, commentsPerPage, isNews, isMobile]);

	// 초기 또는 페이지 변경 시 댓글 불러오기
	useEffect(() => {
		fetchComments(currentPage, isMobile); // 모바일은 append 방식
	}, [currentPage, fetchComments, isMobile]);

	// searchParams가 바뀌었을 때 currentPage를 갱신
	useEffect(() => {
		if (!isMobile && pageParam) {
			setCurrentPage(Number(pageParam));
		}
	}, [pageParam, isMobile]);

	// 로컬스토리지에서 좋아요 상태 복원
	useEffect(() => {
		const storedLikes = localStorage.getItem('likedComments');
		if (storedLikes) {
			setLikedComments(JSON.parse(storedLikes));
		}
	}, []);

	// 모바일에서 '더 보기' 클릭 시 댓글 추가 로드
	const handleLoadMoreComment = async () => {
		const nextPage = currentPage + 1;
		const response = await getCommentList(contentsId, nextPage, commentsPerPage, isNews);
		const newComments = response?.data || [];

		setComments((prev) => [...prev, ...newComments]);
		setCurrentPage(nextPage);
		// 로드된 페이지 추적
		setLoadedPages((prev) => [...prev, nextPage]);

		if (nextPage >= (response.meta?.totalPages || 1)) {
			setIsLastPageLoaded(true);
		}
	};

	// 댓글 또는 대댓글 작성 후 처리
	const handleCommentSubmit = async (isReply: boolean, parentPk?: number) => {
		setTotalReplies(totalreplies + 1); // 댓글 수 증가

		if (isReply && parentPk !== undefined) {
			// 대댓글 작성 후 대댓글 입력창 닫고 대댓글 보이게 하기
			setReplyingTo((prev) => prev.filter((id) => id !== parentPk));
			setReplyVisibilities((prev) => ({ ...prev, [parentPk]: true }));

			// 해당 댓글의 최신 상태를 다시 불러와 갱신
			try {
				const response = await getCommentList(contentsId, currentPage, commentsPerPage, isNews);
				const updatedComment = response?.data.find((c) => c.pk === parentPk);
				if (updatedComment) {
					setComments((prev) => prev.map((c) => (c.pk === parentPk ? updatedComment : c)));
				}
			} catch {
				console.error('대댓글 업데이트 실패');
			}
			return;
		}

		// 모바일에서 여러 페이지가 로드된 경우 모든 페이지 다시 불러오기
		const reloadedAll = await reloadAllLoadedComments();

		// 모바일이 아니거나 모든 페이지 다시 불러오기 실패한 경우 현재 페이지만 다시 불러오기
		if (!reloadedAll) {
			await fetchComments(currentPage, false);
		}
	};

	// 좋아요 토글
	const toggleCommentLike = async (commentId: number) => {
		// 로그인 안 되어 있으면 모달 열기
		if (!currentUserInfo) {
			setIsLoginModalOpen(true);
			return;
		}

		const result = await postCommentKick(commentId, isNews);
		if (!result) return;

		// 로컬스토리지 및 상태 업데이트
		setLikedComments((prev) => {
			const updated = { ...prev, [commentId]: !prev[commentId] };
			localStorage.setItem('likedComments', JSON.stringify(updated));
			return updated;
		});

		// 좋아요 수 변경
		setComments((prev) =>
			prev.map((c) =>
				c.pk === commentId ? { ...c, kickCount: c.kickCount + (likedComments[commentId] ? -1 : 1) } : c,
			),
		);
	};

	// 에러 발생 시 에러 카드 표시
	if (hasError) {
		return <FetchingFailedCard height="300px" marginTop="50px" onClick={() => window.location.reload()} />;
	}

	const handleReply = (id: number) => {
		setReplyingTo((prev) => {
			const isAlreadyOpen = prev.includes(id);

			if (isMobile) {
				// 모바일: 무조건 열기만
				return isAlreadyOpen ? prev : [...prev, id];
			} else {
				// PC: 토글
				return isAlreadyOpen ? prev.filter((i) => i !== id) : [...prev, id];
			}
		});
	};

	const closeReplyInput = (id: number) => {
		setReplyingTo((prev) => prev.filter((i) => i !== id));
	};

	// 공통으로 자식 컴포넌트에 전달할 props 모음
	const commentItemProps = {
		type,
		likedComments,
		handleLikeToggle: toggleCommentLike,
		handleReply,
		closeReplyInput,
		toggleReplyVisibility: (id) => setReplyVisibilities((prev) => ({ ...prev, [id]: !prev[id] })),
		replyingTo,
		replyVisibilities,
		isCommentAllowed,
		contentsId,
	};

	return (
		<div className="px-4 mb-4">
			{isCommentAllowed && (
				<CommentInput
					contentType={type}
					contentsId={contentsId}
					onCommentSubmit={(isReply) => handleCommentSubmit(isReply)}
				/>
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
										key={reply.pk}
										content={reply}
										isReply
										parentReply={comment.user.nickname}
										{...commentItemProps}
										onCommentSubmit={handleCommentSubmit}
									/>
								))}
						</div>
					))}
				</div>
			)}

			{totalPages > 1 && (
				<>
					{isMobile ? (
						!isLastPageLoaded && (
							<div className="flex gap-2 justify-center mt-4 cursor-pointer" onClick={handleLoadMoreComment}>
								<div className="button5-regular">더 보기</div>
								<Image src="/chevron/down.svg" alt="댓글 더 보기" width={16} height={16} />
							</div>
						)
					) : (
						<div className="flex justify-center mt-10">
							<PaginationBar totalPages={totalPages} baseUrl={baseUrl} />
						</div>
					)}
				</>
			)}

			{isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
		</div>
	);
}

export default CommentSection;
