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
import usePostViewStatus from '@/lib/hooks/useIsView';

const DetailPage = () => {
	const params = useParams();
	const router = useRouter();

	const [contents, setContents] = useState<CommonPostDetailDto | null>(null);
	const [totalReplies, setTotalReplies] = useState(0);

	const type = params?.type as 'news' | 'board';
	const id = Number(params?.id);
	const isNews = type == 'news';

	const { currentUserInfo } = useCurrentUserInfoStore();

	const isTeamNull = contents?.team == null;
	const isOurTeam = Boolean(currentUserInfo?.favoriteTeams.find((team) => team?.pk === contents?.team?.pk));
	const isCommentAllowed = isTeamNull || isOurTeam;

	const shouldCallApi = usePostViewStatus(id);

	const getDetailContentData = async () => {
		try {
			const contentData = isNews ? await getNewsDetail(id) : await getBoardDetail(id);

			const serverViewCount = contentData.data.views;
			const clientViewCount = shouldCallApi ? serverViewCount + 1 : serverViewCount;

			const finalContents = {
				...contentData,
				data: {
					...contentData.data,
					views: clientViewCount, // 수정한 조회수만 덮어씀
				},
			};

			setContents(finalContents.data);
			setTotalReplies(contentData.data.replies);

			// 세션 스토리지에 저장 (같은 키로 항상 덮어쓰기)
			sessionStorage.setItem('detailContent', JSON.stringify(finalContents));
			console.log('상세조회', contentData);
		} catch (error) {
			console.error('데이터 불러오기 실패:', error);
		}
	};

	useEffect(() => {
		if (!type || !id) {
			router.replace('/404');
			return;
		}

		getDetailContentData();
	}, [type, id]);

	// TODO: 로직 점검 변수명 명확하게 수정!
	const viewSent = useRef(false);

	useEffect(() => {
		if (!contents || viewSent.current || !shouldCallApi) return; // 중복 호출 방지

		if (isNews) {
			createNewsView(id);
		} else {
			createBoardView(id);
		}

		viewSent.current = true;
	}, [contents, id, shouldCallApi, isNews]);

	return (
		<div className="flex flex-col gap-4 @mobile:mb-[80px]">
			<ComponentFrame isMain={true}>
				{contents ? (
					<DetailContent data={contents} type={type} isCommentAllowed={isCommentAllowed} />
				) : (
					<FetchingFailedCard height="800px" marginTop="200px" onClick={getDetailContentData} />
				)}

				<CommentSection
					isCommentAllowed={isCommentAllowed}
					type={type}
					contentsId={contents?.pk || 0}
					totalreplies={totalReplies}
					setTotalReplies={setTotalReplies}
				/>
			</ComponentFrame>

			<RecommendedContent mode={type} teamName={isOurTeam ? contents?.team?.nameKr : ''} />
		</div>
	);
};

export default DetailPage;
