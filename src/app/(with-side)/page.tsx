'use client';

import MatchPredictionCalendar from '@/components/common/match-prediction-calendar';
import PredictLeagueTab from '@/components/features/home/predict-league-tab';
import { useNextMatchDateQuery } from '@/lib/hooks/queries/useNextMatchDateQuery';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import useIsTablet from '@/lib/hooks/useIsTablet';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function Home() {
	// const { currentUserInfo } = useCurrentUserInfoStore();
	const isDesktop = useIsDesktop();
	const isTablet = useIsTablet();

	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	const [selectedDate, setSelectedDate] = useState(new Date());

	const { data: nextDate } = useNextMatchDateQuery();

	useEffect(() => {
		if (!nextDate) return;

		const [year, month, date] = nextDate.split('-').map(Number);
		setSelectedDate(new Date(year, month - 1, date));
	}, [nextDate]);

	return (
		<div className="grid grid-cols-1 min-[120rem]:grid-cols-2 gap-6 pb-90">
			{!isDesktop && (
				<div className={clsx('bg-black-000 rounded-[0.625rem]', isTablet && 'max-w-[39.75rem] w-full mx-auto')}>
					<MatchPredictionCalendar type="match" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
				</div>
			)}
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
