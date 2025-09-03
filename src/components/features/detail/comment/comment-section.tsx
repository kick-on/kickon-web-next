'use client';

import { useEffect, useState } from 'react';
import CommentInput from './comment-input';
import CommentItem from './comment-item';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import PaginationBar from '@/components/common/pagination-bar';
import { useSearchParams } from 'next/navigation';
import useIsMobile from '@/lib/hooks/useIsMobile';
import Image from 'next/image';
import { CommentSectionProps } from './type';
import { getNewsCommentList } from '@/services/apis/news/news-reply.api';
import { getBoardCommentList } from '@/services/apis/board/board-reply.api';

function CommentSection({
	type,
	isCommentAllowed,
	contentsId,
	totalreplies = 0,
	setTotalReplies,
}: CommentSectionProps) {
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const isNews = type === 'news';
	const baseUrl = `/${type}/${contentsId}`;

	const pageParam = searchParams.get('page');
	const [currentPage, setCurrentPage] = useState(pageParam ? Number(pageParam) : 1);
	const [isLastPageLoaded, setIsLastPageLoaded] = useState(false); // 모바일에서 더보기 버튼 나올지 말지

	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

	// 댓글 리스트 조회
	const [comments, setComments] = useState([]);
	const [hasError, setHasError] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const commentsPerPage = 10;

	const fetchComments = async () => {
		if (!contentsId || contentsId < 1) return;

		const query = {
			id: contentsId,
			page: currentPage,
			size: commentsPerPage,
			...(isMobile ? { infinite: true, lastReply: comments.at(-1).pk } : {}),
		};
		try {
			const response = isNews ? await getNewsCommentList(query) : await getBoardCommentList(query);

			console.log('댓글 리스트', response);
			if (isMobile) {
				setComments((prev) => [...prev, ...response?.data]);
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
	};

	// 초기 접속 또는 페이지 변경 시 댓글 불러오기
	useEffect(() => {
		fetchComments();
	}, [currentPage, contentsId]);

	// searchParams가 바뀌었을 때 currentPage를 갱신
	useEffect(() => {
		if (!isMobile && pageParam) {
			setCurrentPage(Number(pageParam));
		}
	}, [pageParam, isMobile]);

	// // 로컬스토리지에서 좋아요 상태 복원
	// useEffect(() => {
	// 	const storedLikes = localStorage.getItem('likedComments');
	// 	if (storedLikes) {
	// 		setLikedComments(JSON.parse(storedLikes));
	// 	}
	// }, []);

	// 모바일에서 '더 보기' 클릭 시 댓글 추가 로드
	const handleLoadMoreComment = async () => {
		const nextPage = currentPage + 1;
		const query = {
			id: contentsId,
			page: nextPage,
			size: commentsPerPage,
			infinite: true,
			lastReply: comments.at(-1).pk,
		};
		const response = isNews ? await getNewsCommentList(query) : await getBoardCommentList(query);

		const newComments = response?.data || [];

		setComments((prev) => [...prev, ...newComments]);
		setCurrentPage(nextPage);

		if (nextPage >= (response.meta?.totalPages || 1)) {
			setIsLastPageLoaded(true);
		}
	};

	const commentItemProps = {
		type,
		isCommentAllowed,
		contentsId,
		editingCommentId,
		setEditingCommentId,
		setComments,
	};

	// 에러 발생 시 에러 카드 표시
	if (hasError) {
		return <FetchingFailedCard height="300px" marginTop="50px" onClick={() => window.location.reload()} />;
	}

	return (
		<div className="px-4">
			{isCommentAllowed && (
				<CommentInput contentType={type} contentsId={contentsId} editingCommentId={editingCommentId} />
			)}

			<p className="body5-regular -mx-4 text-black-600 border-t border-b border-black-200 px-4 py-3">
				댓글 <span className="text-black-900">{totalreplies}</span>개
			</p>

			{comments.length === 0 ? (
				<p className="text-center body5-regular text-black-500 py-10">댓글이 없습니다.</p>
			) : (
				<div className="flex flex-col pr-2">
					{comments.map((comment) => (
						<CommentItem key={comment.pk} content={comment} {...commentItemProps} />
					))}
				</div>
			)}

			{totalPages > 1 && (
				<>
					{isMobile ? (
						!isLastPageLoaded && (
							<div className="flex gap-2 justify-center my-4 cursor-pointer" onClick={handleLoadMoreComment}>
								<div className="button5-regular">더 보기</div>
								<Image src="/chevron/down.svg" alt="댓글 더 보기" width={16} height={16} />
							</div>
						)
					) : (
						<div className="flex justify-center">
							<PaginationBar totalPages={totalPages} baseUrl={baseUrl} />
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default CommentSection;
