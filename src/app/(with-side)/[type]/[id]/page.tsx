'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ComponentFrame from '@/components/common/component-frame';
import RecommendedContent from '@/components/common/recommended-content';
import DetailContent from '@/components/features/detail/content/detail-content';
import CommentSection from '@/components/features/detail/comment/comment-section';
import FetchingFailedCard from '@/components/common/fetching-failed-card';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getNewsDetail } from '@/services/apis/news/news.api';
import { getBoardDetail } from '@/services/apis/board/board.api';
import { CommonPostDetailDto } from '@/services/apis/common/types';
import { createNewsView } from '@/services/apis/news/news-view-history.api';
import { createBoardView } from '@/services/apis/board/board-view-history.api';
import usePostViewStatus from '@/lib/hooks/usePostViewStatus';
import { usePollStore } from '@/lib/store/usePollStore';

const DetailPage = () => {
	const params = useParams();
	const router = useRouter();

	const [postDetail, setPostDetail] = useState<CommonPostDetailDto | null>(null);

	const type = params?.type as 'news' | 'board';
	const id = Number(params?.id);
	const isNews = type == 'news';

	const { currentUserInfo } = useCurrentUserInfoStore();

	const isTeamNull = postDetail?.team == null;
	const isOurTeam = Boolean(currentUserInfo?.favoriteTeams.find((team) => team?.pk === postDetail?.team?.pk));
	const isCommentAllowed = isTeamNull || isOurTeam;

	const shouldCallApi = usePostViewStatus(id);

	const getPostDetail = async () => {
		try {
			const response = isNews ? await getNewsDetail(id) : await getBoardDetail(id);

			const serverViewCount = response.data.views;
			const clientViewCount = shouldCallApi ? serverViewCount + 1 : serverViewCount;

			const finalPostDetail = {
				...response,
				data: {
					...response.data,
					views: clientViewCount, // 수정한 조회수만 덮어씀
				},
			};

			setPostDetail(finalPostDetail.data);

			// 세션 스토리지에 저장 (같은 키로 항상 덮어쓰기)
			// IDEA: 수정 버튼을 클릭할 때 저장하면 어떨지
			sessionStorage.setItem('detailContent', JSON.stringify(finalPostDetail));
			// console.log('상세조회', response);
		} catch (error) {
			console.error('데이터 불러오기 실패:', error);
		}
	};

	useEffect(() => {
		if (!type || !id) {
			router.replace('/404');
			return;
		}

		getPostDetail();
	}, [type, id]);

	// TODO: 로직 점검 -> hasViewApiCalled 안 쓰는 방향으로...!!
	const hasViewApiCalled = useRef(false);

	useEffect(() => {
		if (!postDetail || hasViewApiCalled.current || !shouldCallApi) return;

		if (isNews) {
			createNewsView(id);
		} else {
			createBoardView(id);
		}

		hasViewApiCalled.current = true;
	}, [postDetail, id, shouldCallApi, isNews]);

	const { clearPollStore } = usePollStore();
	useEffect(() => {
		return () => {
			clearPollStore();
		};
	}, []);

	return (
		<div className="flex flex-col gap-4 @mobile:mb-[80px]">
			<ComponentFrame isMain={true} className="overflow-hidden">
				{postDetail ? (
					<DetailContent commonDetailData={postDetail} type={type} isCommentAllowed={isCommentAllowed} />
				) : (
					<FetchingFailedCard height="800px" marginTop="200px" onClick={getPostDetail} />
				)}

				<CommentSection isCommentAllowed={isCommentAllowed} postType={type} postId={postDetail?.pk || 0} />
			</ComponentFrame>

			<RecommendedContent mode={type} teamName={isOurTeam ? postDetail?.team?.nameKr : ''} />
		</div>
	);
};

export default DetailPage;
