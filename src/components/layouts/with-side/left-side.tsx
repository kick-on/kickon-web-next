'use client';

import MatchPredictionCalendar from '@/components/common/match-prediction-calendar';
import RankingList from './ranking-list/ranking-list';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import useIsMobile from '@/lib/hooks/useIsMobile';
import ComponentFrame from '@/components/common/component-frame';

export default function LeftSide() {
	const isMobile = useIsMobile();
	const isLeftSideVisible = useIsLeftSideVisible();

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
