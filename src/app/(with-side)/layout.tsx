'use client';

import { usePathname } from 'next/navigation';
import FloatingWritingButton from '@/components/common/FloatingWritingButton';
import MostReadNewsList from '@/components/layouts/with-side-layout/most-read-news-list/most-read-news-list';
import Account from '@/components/layouts/with-side-layout/account';
import RankingList from '@/components/layouts/with-side-layout/ranking-list/ranking-list';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	return (
		<div className="pt-4 max-w-[85rem] m-auto grid-cols-[1fr_auto_1fr] grid gap-6">
			<aside className="flex flex-col gap-4">
				<RankingList mode="season" />
				<RankingList mode="predict" />
			</aside>
			<main className="flex flex-col gap-4">{children}</main>
			<aside className="flex flex-col gap-4 relative">
				<Account />
				<MostReadNewsList />
				{pathname !== '/' && <FloatingWritingButton />}
			</aside>
		</div>
	);
}
