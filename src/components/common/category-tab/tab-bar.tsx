'use client';

import Link from 'next/link';
import clsx from 'clsx';
import SelectBox from './select-box';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import Image from 'next/image';

export default function TabBar({ mode, q, type }: { mode: 'news' | 'board'; q: string; type: string }) {
	const { currentUserInfo } = useCurrentUserInfoStore();

	const tabs = ['전체', '인기', currentUserInfo ? 'MY 팀' : null];
	const isNews = mode === 'news';

	return (
		<div className="flex gap-3 pt-[0.9375rem] @mobile:pt-2 pl-4 header-medium border-b border-black-300">
			{tabs.map((tab, i) =>
				!tab ? null : (
					<Link
						href={`/${mode}?q=${tab}` + (i === 2 ? `&type=team&id=${currentUserInfo?.favoriteTeam?.pk}` : '')}
						key={tab}
						className={clsx(
							'flex px-2 @max-[350px]:px-1 py-[0.9375rem] border-b-2',
							q === tab ? 'border-primary-900 text-primary-900 header-semibold' : 'border-transparent',
						)}
					>
						{tab}
						{i === 2 && (
							<Image
								src={currentUserInfo?.favoriteTeam?.logoUrl}
								alt="로고 이미지"
								width={16}
								height={16}
								className="w-4 h-4 ml-0.5 object-contain"
							/>
						)}
					</Link>
				),
			)}
			{isNews && (
				<div>
					<SelectBox q={q} type={type} isClickedOtherTab={tabs.includes(q)} />
				</div>
			)}
		</div>
	);
}
