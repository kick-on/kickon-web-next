import { notFound } from 'next/navigation';

import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import DetailContent from '@/components/features/detail/content/DetailContent';
import CommentSection from '@/components/features/detail/comment/CommentSection';
import { getDetailContent } from '@/services/apis/detail';
import FetchingFailedCard from '@/components/common/fetching-failed-card';

import { GetDetailResponse } from '@/services/apis/detail/dto';
import { getCommentList } from '@/services/apis/detail/comment';
import { GetCommentsResponse } from '@/services/apis/detail/comment/dto';
import PrivacyAgreementButton from '@/components/features/button';
import PaginationBar from '@/components/common/pagination-bar.tsx/pagination-bar';

const DetailPage = async ({
	params,
	searchParams,
}: {
	params?: { type?: string; id?: string };
	searchParams?: { page?: string };
}) => {
	if (!params?.type || !params?.id) return notFound();

	const { type, id } = params;
	const currentPage = Number(searchParams?.page || '1');
	const commentsPerPage = 10;

	const contents = (await getDetailContent(type as 'news' | 'board', Number(id))) as GetDetailResponse;

	const comments = (await getCommentList(
		Number(id),
		currentPage,
		commentsPerPage,
		type === 'news',
	)) as GetCommentsResponse;

	const totalComments = comments.data.length || 0;

	// 총 페이지 수 계산 (최소 1페이지)
	const totalPages = Math.max(1, Math.ceil(totalComments / commentsPerPage));

	// 현재 URL 경로 (쿼리 파라미터 제외)
	const baseUrl = `/${type}/${id}`;

	return (
		<div className="flex flex-col gap-4">
			<ComponentFrame isMain={true}>
				{contents.data ? (
					<>
						<DetailContent data={contents.data} type={type} />
						<PrivacyAgreementButton />
					</>
				) : (
					<FetchingFailedCard height="800px" marginTop="200px" onClick={() => {}} />
				)}
				{comments ? (
					<>
						<CommentSection type={type} comments={comments.data} contentsId={contents.data.pk} />
						{totalComments > 0 && <PaginationBar totalPages={totalPages} baseUrl={baseUrl} />}
					</>
				) : (
					<FetchingFailedCard height="300px" marginTop="50px" onClick={() => {}} />
				)}
			</ComponentFrame>

			<RecommendedContent mode="뉴스" teamName="FC 서울" />
		</div>
	);
};

export default DetailPage;
