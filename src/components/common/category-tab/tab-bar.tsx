'use client';

import Link from 'next/link';
import clsx from 'clsx';
import Selectbox from './select-box';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import Image from 'next/image';
import { Suspense } from 'react';
import TeamBar from './team-bar';

export default function TabBar({ mode, q, type, id }: { mode: 'news' | 'board'; q: string; type: string; id: string }) {
	const { currentUserInfo } = useCurrentUserInfoStore();

	const tabs = ['전체', '인기', currentUserInfo?.favoriteTeams.length > 0 ? 'MY 팀' : null];
	const isNews = mode === 'news';

	return (
		<div>
			{/* 탭 바 */}
			<div
				className="relative w-full flex rounded-t-[0.625rem] bg-black-200 header-medium
				@mobile:grid @mobile:grid-cols-[1fr_1fr_1fr_clamp(100px,30vw,150px)]
				before:content-[''] before:absolute before:-top-1 before:-left-1 before:bottom-0 before:-right-1
				before:inset-shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.10)]
				after:content-[''] after:absolute after:-bottom-4 after:left-0 after:right-0
				after:h-4 after:bg-black-000"
			>
				{tabs.map((tab, i) =>
					!tab ? null : (
						<Link
							href={`/${mode}?q=${tab}` + (i === 2 ? `&type=team&id=${currentUserInfo?.favoriteTeams[0]?.pk}` : '')}
							key={tab}
							className={clsx(
								`relative flex pt-[1.0625rem] pb-[0.9375rem] rounded-t-[0.625rem]
							w-[5.625rem] @mobile:w-full justify-center before:rounded-t-[0.625rem]
							before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0
							before:bg-black-000 before:shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)]`,
								q === tab
									? 'before:block header-semibold text-primary-900'
									: 'before:hidden text-black-700 hover:text-black-900 ',
							)}
						>
							<div className="relative z-20">{tab}</div>
							{i === 2 && (
								<Image
									src={
										id
											? currentUserInfo?.favoriteTeams.find((team) => id === String(team.pk))?.logoUrl
											: currentUserInfo?.favoriteTeams[0].logoUrl
									}
									alt="로고 이미지"
									width={16}
									height={16}
									className="w-4 h-4 ml-0.5 object-contain relative z-20"
								/>
							)}
						</Link>
					),
				)}

				{/* 리그 선택 */}
				{isNews && (
					<Suspense>
						<Selectbox q={q} type={type} isClickedOtherTab={type !== 'league'} />
					</Suspense>
				)}
			</div>

			{/* 팀 선택 바 - 응원팀이 2개 이상일 때 */}
			<Suspense>{type === 'team' && currentUserInfo?.favoriteTeams?.length > 1 && <TeamBar />}</Suspense>
		</div>
	);
}
