'use client';

import { UAParser } from 'ua-parser-js';
import RankingList from '../with-side/ranking-list/ranking-list';
import useIsTablet from '@/lib/hooks/useIsTablet';

export default function LeftSide() {
	const device = UAParser().device;
	const isMobile = device.type === 'mobile';
	const isTablet = useIsTablet();

	if (isMobile || isTablet) return null;

	return (
		<aside className="tablet:hidden flex flex-col gap-4">
			<RankingList mode="season" />
			<RankingList mode="predict" />
		</aside>
	);
}
