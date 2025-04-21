'use client';

import { UAParser } from 'ua-parser-js';
import RankingList from './ranking-list/ranking-list';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { useEffect, useState } from 'react';

export default function LeftSide() {
	const [isMobile, setIsMobile] = useState<boolean | null>(null);
	const isLeftSideVisible = useIsLeftSideVisible();

	useEffect(() => {
		const device = UAParser().device;
		setIsMobile(device.type === 'mobile');
	}, []);

	if (isMobile === null || isMobile || !isLeftSideVisible) return null;

	return (
		<aside className="flex flex-col gap-4">
			<RankingList mode="season" />
			<RankingList mode="predict" />
		</aside>
	);
}
