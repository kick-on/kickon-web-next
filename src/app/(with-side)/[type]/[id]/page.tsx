'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';

import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import DetailContent from '@/components/features/detail/content/DetailContent';
import CommentSection from '@/components/features/detail/comment/CommentSection';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import PaginationBar from '@/components/common/pagination-bar.tsx/pagination-bar';

import { getDetailContent } from '@/services/apis/detail';
import { getCommentList } from '@/services/apis/detail/comment';

import { GetDetailResponse } from '@/services/apis/detail/dto';
import { GetCommentsResponse } from '@/services/apis/detail/comment/dto';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { PostContentView } from '@/services/apis/detail/view';

const DetailPage = () => {
	const params = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [contents, setContents] = useState<GetDetailResponse | null>(null);
	const [comments, setComments] = useState<GetCommentsResponse | null>(null);
	const [, setIsLoading] = useState(true);

	const type = params?.type as 'news' | 'board';
	const id = Number(params?.id);
	const isNews = type == 'news';
	const currentPage = Number(searchParams.get('page') || '1');
	const commentsPerPage = 10;

	const { currentUserInfo } = useCurrentUserInfoStore();
	const isOurTeamPost = currentUserInfo?.teamPk == contents?.data?.team?.pk;
	console.log(currentUserInfo);
	console.log(currentUserInfo?.teamPk);
	console.log(contents?.data?.team?.pk);

	useEffect(() => {
		if (!type || !id) {
			router.replace('/404');
			return;
		}

		const getDetailContentData = async () => {
			try {
				const contentData = await getDetailContent(type, id);
				const commentData = await getCommentList(id, currentPage, commentsPerPage, isNews);
				console.log(contentData);
				setContents(contentData);
				setComments(commentData);
			} catch (error) {
				console.error('데이터 불러오기 실패:', error);
			} finally {
				setIsLoading(false);
			}
		};

		getDetailContentData();
	}, [type, id, currentPage, router, isNews]);

	const viewSent = useRef(false);

	useEffect(() => {
		if (!contents || viewSent.current) return; // 중복 호출 방지

		console.log('👀 PostContentView 호출!');
		PostContentView({
			requestBody: { [type === 'news' ? 'news' : 'board']: id },
			isNews: type === 'news',
		}).then(console.log);

		viewSent.current = true;
	}, [contents, type, id]);

	const totalComments = contents?.data.replies || 0;
	const totalPages = Math.max(1, Math.ceil(totalComments / commentsPerPage));
	const baseUrl = `/${type}/${id}`;

	return (
		<div className="flex flex-col gap-4">
			<ComponentFrame isMain={true}>
				{contents?.data ? (
					<DetailContent data={contents.data} type={type} isOurTeamPost={isOurTeamPost} />
				) : (
					<FetchingFailedCard height="800px" marginTop="200px" onClick={() => {}} />
				)}

				{comments?.data ? (
					<>
						<CommentSection
							isOurTeamPost={isOurTeamPost}
							type={type}
							comments={comments.data}
							contentsId={contents?.data?.pk || 0}
							totalreplies={contents?.data?.replies}
						/>
						{totalComments > 0 && <PaginationBar totalPages={totalPages} baseUrl={baseUrl} />}
					</>
				) : (
					<FetchingFailedCard height="300px" marginTop="50px" onClick={() => {}} />
				)}
			</ComponentFrame>

			<RecommendedContent mode={type} teamName={isOurTeamPost ? contents?.data.team.nameEn : ''} />
		</div>
	);
};

export default DetailPage;
