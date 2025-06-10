'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TeamBar() {
	const pathname = usePathname();

	const { currentUserInfo } = useCurrentUserInfoStore();
	const teams = currentUserInfo?.favoriteTeams;

	if (!teams) return;

	return (
		<>
			<div className="mt-5 mb-3 mx-4 @mobile:mx-0 flex gap-1.5 items-center text-black-400 subtitle1-medium">
				{teams.map((team, i) => (
					<>
						<Link
							key={team.pk}
							href={`${pathname}?q=MY 팀&type=team&id=${team.pk}`}
							className="px-3 py-1.5 flex gap-0.5 items-center"
						>
							<Image
								src={team.logoUrl}
								alt={`${team.nameKr} 로고`}
								width={20}
								height={20}
								className="w-5 h-5 object-contain"
							/>
							{team.nameKr || team.nameEn}
						</Link>
						{i < teams.length - 1 && <div className="h-3 w-[1px] rounded-full bg-black-600" />}
					</>
				))}
			</div>
			<hr className="mx-4 mb-1.5 w-auto border-black-200" />
		</>
	);
}
