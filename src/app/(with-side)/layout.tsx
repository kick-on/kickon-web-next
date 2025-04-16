import FloatingWritingButton from '@/components/common/floating-writing-button';
import MostReadNewsList from '@/components/layouts/with-side/most-read-news-list/most-read-news-list';
import Profile from '@/components/layouts/with-side/profile';
import RankingList from '@/components/layouts/with-side/ranking-list/ranking-list';
import { ReactNode, Suspense } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="pt-4 max-w-[85rem] m-auto grid-cols-[1fr_auto_1fr] grid gap-6">
			<aside className="flex flex-col gap-4">
				<RankingList mode="season" />
				<RankingList mode="predict" />
			</aside>
			<main className="flex flex-col gap-4">{children}</main>
			<aside className="flex flex-col gap-4 relative">
				<Suspense>
					<Profile />
				</Suspense>
				<MostReadNewsList />
				<FloatingWritingButton />
			</aside>
		</div>
	);
}
