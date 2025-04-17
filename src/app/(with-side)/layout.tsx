import FloatingWritingButton from '@/components/common/floating-writing-button';
import MostReadNewsList from '@/components/layouts/with-side/most-read-news-list/most-read-news-list';
import Profile from '@/components/layouts/with-side/profile';
import RankingList from '@/components/layouts/with-side/ranking-list/ranking-list';
import { ReactNode, Suspense } from 'react';
import clsx from 'clsx';
import getDeviceType from '@/lib/utils/getDeviceType';

export default async function Layout({ children }: { children: ReactNode }) {
	const { isMobile } = await getDeviceType();

	return (
		<div className={clsx('pt-4 max-w-[85rem] m-auto grid gap-6', { 'grid-cols-[1fr_auto_1fr]': !isMobile })}>
			{!isMobile && (
				<aside className="flex flex-col gap-4">
					<RankingList mode="season" />
					<RankingList mode="predict" />
				</aside>
			)}
			<main className="flex flex-col gap-4">{children}</main>
			{!isMobile && (
				<aside className="flex flex-col gap-4 relative">
					<Suspense>
						<Profile />
					</Suspense>
					<MostReadNewsList />
					<FloatingWritingButton />
				</aside>
			)}
		</div>
	);
}
