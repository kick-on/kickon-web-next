'use client';

import { Suspense } from 'react';
import Profile from '../with-side/profile';
import MostReadNewsList from '../with-side/most-read-news-list/most-read-news-list';
import { UAParser } from 'ua-parser-js';
import useIsTablet from '@/lib/hooks/useIsTablet';

export default function RightSide() {
	const device = UAParser().device;
	const isMobile = device.type === 'mobile';
	const isTablet = useIsTablet();

	if (isMobile || isTablet) return null;

	return (
		<aside className="flex flex-col gap-4 relative">
			<Suspense>
				<Profile />
			</Suspense>
			<MostReadNewsList />
		</aside>
	);
}
