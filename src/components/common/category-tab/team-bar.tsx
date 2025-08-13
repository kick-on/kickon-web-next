'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TeamBar() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const isNews = pathname.split('/').includes('news');

	const { currentUserInfo } = useCurrentUserInfoStore();
	const teams = currentUserInfo?.favoriteTeams;

	if (teams.length === 0) return;

	return (
		<>
			<div
				className="w-full mt-5 mb-3 px-4 @mobile:px-0 subtitle1-medium
					flex items-center @mobile:grid @mobile:grid-cols-[auto_auto_auto]"
			>
				{teams.map((team, i) => (
					<div
						key={team.pk}
						className={clsx(
							'flex items-center @mobile:w-full',
							id === String(team.pk) ? 'font-semibold text-primary-900' : 'text-black-400',
						)}
					>
						<Link
							href={`${pathname}?q=MY 팀&type=team&id=${team.pk}`}
							className="px-3 py-1.5 grid grid-cols-[auto_1fr] gap-0.5 items-center w-full"
						>
							<Image
								src={team.logoUrl}
								alt={`${team.nameKr} 로고`}
								width={20}
								height={20}
								className="w-5 h-5 object-contain"
							/>
							<span className="w-full truncate">{team.nameKr || team.nameEn}</span>
						</Link>
						{i < teams.length - 1 && <div className="h-3 w-[1px] mx-1.5 rounded-full bg-black-600" />}
					</div>
				))}
			</div>
			<hr className={clsx('mb-1.5 w-auto border-black-300', { 'mx-4': isNews })} />
		</>
	);
}
