'use client';

import { useEffect, useState } from 'react';
import CommentInput from './comment-input';
import CommentItem from './comment-item';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import PaginationBar from '@/components/common/pagination-bar';
import { useSearchParams } from 'next/navigation';
import useIsMobile from '@/lib/hooks/useIsMobile';
import Image from 'next/image';
import { CommentItemProps, CommentSectionProps } from './type';
import { useCommentListQuery, useTotalCommentCountQuery } from '@/lib/hooks/queries/useReplyQuery';

function CommentSection({ postType, postId, isCommentAllowed }: CommentSectionProps) {
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const baseUrl = `/${postType}/${postId}`;

	const pageParam = searchParams.get('page');
	const [currentPage, setCurrentPage] = useState(pageParam ? Number(pageParam) : 1);

	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

	const commentsPerPage = 10;
	const query = {
		id: postId,
		page: currentPage,
		size: commentsPerPage,
		...(isMobile ? { infinite: true } : {}),
	};

	// 댓글 리스트 조회
	const {
		data: commentListData,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
		isError,
	} = useCommentListQuery(postType, query);
	const currentPageComments = commentListData?.pages[Number(pageParam ?? 0)]?.data ?? [];
	const allPageComments = commentListData?.pages.flatMap((page) => page.data) ?? [];
	const comments = isMobile ? allPageComments : currentPageComments;
	const totalPages = commentListData?.pages[0]?.meta.totalPages;
	const { data: totalComments } = useTotalCommentCountQuery(postType, postId);

	// searchParams가 바뀌었을 때 currentPage를 갱신
	useEffect(() => {
		if (!isMobile && pageParam) {
			setCurrentPage(Number(pageParam));
		}
	}, [pageParam, isMobile]);

	// 모바일에서 '더 보기' 클릭 시 댓글 추가 로드
	const handleLoadMoreComment = async () => {
		if (isFetchingNextPage) return;
		await fetchNextPage();
	};

	const commentItemProps: Omit<CommentItemProps, 'comment'> = {
		postType,
		postId,
		isCommentAllowed,
		editingCommentId,
		setEditingCommentId,
	};

	if (isError) {
		return <FetchingFailedCard height="300px" marginTop="50px" onClick={() => window.location.reload()} />;
	}

	return (
		<div>
			{isCommentAllowed && <CommentInput postType={postType} postId={postId} editingCommentId={editingCommentId} />}

			<p className="body5-regular text-black-600 border-t border-b border-black-200 px-4 py-3">
				댓글 <span className="text-black-900">{totalComments}</span>개
			</p>

			{comments.length === 0 ? (
				<p className="text-center body5-regular text-black-500 py-10">댓글이 없습니다.</p>
			) : (
				<div className="flex flex-col">
					{comments.map((comment) => (
						<CommentItem key={comment.pk} comment={comment} {...commentItemProps} />
					))}
				</div>
			)}

			{totalPages > 1 && (
				<>
					{isMobile ? (
						hasNextPage && (
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
