'use client';

import MatchPredictionCalendar from '@/components/common/match-prediction-calendar';
import RankingList from './ranking-list/ranking-list';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import useIsMobile from '@/lib/hooks/useIsMobile';
import ComponentFrame from '@/components/common/component-frame';
import { useNextMatchDateQuery } from '@/lib/hooks/queries/useNextMatchDateQuery';
import { useEffect } from 'react';
import { useCalendarStore } from '@/lib/store/useCalendarStore';

export default function LeftSide() {
	const isMobile = useIsMobile();
	const isLeftSideVisible = useIsLeftSideVisible();
	const { selectedDate, setSelectedDate } = useCalendarStore();

	const { data: nextDate } = useNextMatchDateQuery();

	useEffect(() => {
		if (!nextDate) return;

		const [year, month, date] = nextDate.split('-').map(Number);
		setSelectedDate(new Date(year, month - 1, date));
	}, [nextDate, setSelectedDate]);

	if (isMobile === null || isMobile || !isLeftSideVisible) return null;

	return (
		<aside className="flex flex-col gap-4">
			<ComponentFrame>
				<MatchPredictionCalendar type="match" />
			</ComponentFrame>
			<RankingList mode="season" />
			{/*<RankingList mode="predict" />*/}
		</aside>
	);
}
