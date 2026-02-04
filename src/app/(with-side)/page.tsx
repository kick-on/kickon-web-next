'use client';

import PredictLeagueTab from '@/components/features/home/predict-league-tab';
import { useEffect } from 'react';

export default function Home() {
	// const { currentUserInfo } = useCurrentUserInfoStore();
	// const isDesktop = useIsDesktop();

	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	return (
		<div className="grid grid-cols-1 min-[120rem]:grid-cols-2 gap-6 pb-90">
			{/* 승부 예측 */}
			<div className="bg-black-000 rounded-[0.625rem]">
				<PredictLeagueTab />
			</div>
			<div className="bg-black-000 rounded-[0.625rem]">
				<PredictLeagueTab />
			</div>
			<div className="bg-black-000 rounded-[0.625rem]">
				<PredictLeagueTab />
			</div>
			<div className="bg-black-000 rounded-[0.625rem]">
				<PredictLeagueTab />
			</div>

			{/*{!isDesktop && <TodaysHalftime />}*/}

			{/* 추천 뉴스 및 게시글 */}
			{/*<Suspense>*/}
			{/*	<RecommendedContent*/}
			{/*		mode={'news'}*/}
			{/*		teamName={currentUserInfo?.favoriteTeams[0]?.nameKr || currentUserInfo?.favoriteTeams[0]?.nameEn || undefined}*/}
			{/*	/>*/}
			{/*	<RecommendedContent mode={'board'} />*/}
			{/*</Suspense>*/}
		</div>
	);
}
