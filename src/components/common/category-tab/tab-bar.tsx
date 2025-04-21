'use client';

import Link from 'next/link';
import clsx from 'clsx';
import SelectBox from './select-box';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

export default function TabBar({ mode, q, type }: { mode: 'news' | 'board'; q: string; type: string }) {
	const { currentUserInfo } = useCurrentUserInfoStore();

	const tabs = [
		'전체',
		'인기',
		currentUserInfo ? currentUserInfo.favoriteTeam?.nameKr || currentUserInfo.favoriteTeam?.nameEn : null,
	];
	const isNews = mode === 'news';

	return (
		<div className="flex gap-4 pt-[0.9375rem] pl-4 header-medium border-b border-black-300">
			{tabs.map((tab, i) =>
				!tab ? null : (
					<Link
						href={`/${mode}?q=${tab}` + (i === 2 ? `&type=team&id=${currentUserInfo?.favoriteTeam?.pk}` : '')}
						key={tab}
						className={clsx(
							'px-[0.5rem] py-[0.9375rem] border-b-2',
							q === tab ? 'border-primary-900 text-primary-900 header-semibold' : 'border-transparent',
						)}
					>
						{tab}
					</Link>
				),
			)}
			{isNews && (
				<div
					className={clsx(
						'border-b-2',
						tabs.includes(q) ? 'border-transparent' : 'border-primary-900 text-primary-900 header-semibold',
					)}
				>
					<SelectBox q={q} type={type} isClickedOtherTab={tabs.includes(q)} />
				</div>
			)}
		</div>
	);
}
