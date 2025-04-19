'use client';

import { UAParser } from 'ua-parser-js';
import RankingList from '../with-side/ranking-list/ranking-list';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';

export default function LeftSide() {
	const device = UAParser().device;
	const isMobile = device.type === 'mobile';
	const isLeftSideVisible = useIsLeftSideVisible();

	if (isMobile || !isLeftSideVisible) return null;

	return (
		<aside className="flex flex-col gap-4">
			<RankingList mode="season" />
			<RankingList mode="predict" />
		</aside>
	);
}
