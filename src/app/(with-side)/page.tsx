'use client';

import RecommendedContent from '@/components/common/recommended-content';
import PredictLeagueTab from '@/components/features/home/predict-league-tab';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { Suspense, useEffect } from 'react';

export default function Home() {
	const { currentUserInfo } = useCurrentUserInfoStore();

	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	return (
		<div className="flex flex-col gap-4">
			{/* 승부 예측 */}
			<PredictLeagueTab />

			{/* 추천 뉴스 및 게시글 */}
			<Suspense>
				<RecommendedContent
					mode={'news'}
					teamLogo={currentUserInfo?.favoriteTeams[0]?.logoUrl}
					teamName={currentUserInfo?.favoriteTeams[0]?.nameKr || currentUserInfo?.favoriteTeams[0]?.nameEn || undefined}
				/>
				<RecommendedContent mode={'board'} />
			</Suspense>
		</div>
	);
}
