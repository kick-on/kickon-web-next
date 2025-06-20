'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import PredictCardList from './predict-card-list';

export default function PredictLeagueTab() {
	const { currentUserInfo } = useCurrentUserInfoStore();
	const [selectedIndex, setSelectedIndex] = useState(0);
	// TODO: selectedLeaguePk 만들어서 PredictCardList에 leaguePk 넘겨줘야 함

	const leagues = currentUserInfo?.favoriteTeams ?? [];

	// 응원팀이 하나 이상 있는 경우 전체 탭
	// 응원팀이 없거나 비회원인 경우 프리미어리그 탭
	const firstTab =
		currentUserInfo?.favoriteTeams.length > 0
			? '전체'
			: {
					pk: 1,
					nameKr: '프리미어리그',
					nameEn: 'Premier League',
					logoUrl: 'https://media.api-sports.io/football/leagues/39.png',
					type: 'League',
				};
	const tabs = [firstTab, ...leagues];

	return (
		<div>
			{/* 탭 바 */}
			<div
				className="relative w-full flex rounded-t-[0.625rem] bg-black-200 header-medium
          @mobile:grid @mobile:grid-cols-4 before:content-[''] before:absolute
          before:-top-1 before:-left-1 before:bottom-0 before:-right-1
          before:inset-shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.10)]
          after:content-[''] after:absolute after:-bottom-4 after:left-0 after:right-0
          after:h-4 after:bg-black-000"
			>
				{tabs.map((league, i) => (
					<button
						key={typeof league === 'string' ? league : league.pk}
						onClick={() => {
							setSelectedIndex(i);
						}}
						className={clsx(
							`group relative flex items-center h-[3.3125rem] rounded-t-[0.625rem] transition-opacity
              w-[5.625rem] @mobile:w-full justify-center before:rounded-t-[0.625rem]
              before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0
              before:bg-black-000 before:shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)]`,
							i === selectedIndex
								? 'before:block header-semibold text-primary-900'
								: 'before:hidden opacity-70 hover:opacity-100',
						)}
					>
						{typeof league === 'string' ? (
							<div className="relative z-20">{league}</div>
						) : (
							<div
								className={clsx(
									'relative z-20 transition-all',
									i === selectedIndex ? 'w-7 h-7' : 'group-hover:w-7 group-hover:h-7 w-6 h-6 @mobile:w-7 @mobile:h-7',
								)}
							>
								<Image src={league.logoUrl} alt="로고 이미지" fill className="w-auto h-auto object-contain" />
							</div>
						)}
					</button>
				))}
			</div>

			{/* 승부 예측 리스트 */}
			<div className="pt-7 bg-black-000 rounded-b-[0.625rem]">
				<PredictCardList />
			</div>
		</div>
	);
}
