import getServerDeviceType from '@/lib/utils/getServerDeviceType';
import Profile from './profile';
import { Suspense } from 'react';
import TopNewsHalftime from './top-news-halftime/top-news-halftime';

export default async function RightSide() {
	const { isMobile } = getServerDeviceType();

	if (isMobile) return null;

	return (
		<aside className="tablet:hidden flex flex-col gap-4 relative">
			<Suspense>
				<Profile />
			</Suspense>
			<TopNewsHalftime />
		</aside>
	);
}
