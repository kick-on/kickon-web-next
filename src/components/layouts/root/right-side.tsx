'use client';

import { Suspense, useEffect, useState } from 'react';
import Profile from '../with-side/profile';
import MostReadNewsList from '../with-side/most-read-news-list/most-read-news-list';
import { UAParser } from 'ua-parser-js';
import useIsTablet from '@/lib/hooks/useIsTablet';

export default function RightSide() {
	const [isMobile, setIsMobile] = useState<boolean | null>(null);
	const isTablet = useIsTablet();

	useEffect(() => {
		const device = UAParser().device;
		setIsMobile(device.type === 'mobile');
	}, []);

	if (isMobile === null || isMobile || isTablet) return null;

	return (
		<aside className="flex flex-col gap-4 relative">
			<Suspense>
				<Profile />
			</Suspense>
			<MostReadNewsList />
		</aside>
	);
}
