'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ComponentFrame from '@/components/common/component-frame';
import RecommendedContent from '@/components/common/recommended-content';
import DetailContent from '@/components/features/detail/content/detail-content';
import CommentSection from '@/components/features/detail/comment/comment-section';
import FetchingFailedCard from '@/components/common/fetching-failed-card';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getCookie, setCookie } from '@/lib/utils/cookie';
import { getNewsDetail } from '@/services/apis/news/news.api';
import { getBoardDetail } from '@/services/apis/board/board.api';
import { CommonPostDetailDto } from '@/services/apis/common/types';
import { createNewsView } from '@/services/apis/news/news-view-history.api';
import { createBoardView } from '@/services/apis/board/board-view-history.api';

const POST_VIEW_EXPIRY = 60 * 60 * 24 * 1000;

const DetailPage = () => {
	const params = useParams();
	const router = useRouter();

	const [contents, setContents] = useState<CommonPostDetailDto | null>(null);
	const [, setIsLoading] = useState(true);
	const [totalReplies, setTotalReplies] = useState(0);

	const type = params?.type as 'news' | 'board';
	const id = Number(params?.id);
	const isNews = type == 'news';

	const { currentUserInfo } = useCurrentUserInfoStore();

	const isTeamNull = contents?.team == null;
	const isOurTeam = Boolean(currentUserInfo?.favoriteTeams.find((team) => team?.pk === contents?.team?.pk));
	const isCommentAllowed = isTeamNull || isOurTeam;

	const [shouldCallApi, setShouldCallApi] = useState(false);

	const getDetailContentData = async () => {
		try {
			const contentData = isNews ? await getNewsDetail(id) : await getBoardDetail(id);

			// 내 조회가 반영되기 전 서버 조회수
			const serverViewCount = contentData.data.views;

			// shouldCallApi -> true: 글을 처음 본 상태, 조회수 +1, false: 이미 본 적 있음
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
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// (24시간 이내 열람한 게시글 id):(열람 시각) 쌍의 객체
		const cookieValue = getCookie('viewedPosts');
		let viewedPosts: Record<string, number> = {};

		if (cookieValue) {
			try {
				viewedPosts = JSON.parse(cookieValue);
			} catch {
				viewedPosts = {};
			}
		}

		const now = Date.now();
		const lastViewed = viewedPosts[id];

		// 24시간이 지났거나, 처음 보는 글이면 API 호출
		if (!lastViewed || now - lastViewed > POST_VIEW_EXPIRY) {
			setShouldCallApi(true);
			viewedPosts[id] = now;
			setCookie('viewedPosts', JSON.stringify(viewedPosts), 60 * 60 * 24); // max-age(24시간) in seconds
		}
	}, [id]);

	useEffect(() => {
		if (!type || !id) {
			router.replace('/404');
			return;
		}

		getDetailContentData();
	}, [type, id]);

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
