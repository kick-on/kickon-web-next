'use client';

import ComponentFrame from '@/components/common/component-frame';
import RankingItem from './ranking-item';
import SelectBox from './select-box';
import { getActualSeasonRanking, getGambleSeasonRanking } from '@/services/apis/ranking/ranking.api';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import { LeagueDto } from '@/services/apis/league/dto';
import { useCallback, useEffect, useState } from 'react';
import { ActualRankingDto, GambleRankingDto } from '@/services/apis/ranking/ranking.type';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { usePathname } from 'next/navigation';

export default function RankingList({ mode }: { mode: 'season' | 'predict' }) {
	const { currentUserInfo } = useCurrentUserInfoStore();
	const pathname = usePathname();

	const [ranking, setRanking] = useState<GambleRankingDto[] | ActualRankingDto[] | null>();
	const [league, setLeague] = useState<LeagueDto>({
		pk: 1,
		nameKr: '프리미어리그',
		nameEn: 'Premier League',
		logoUrl: 'https://media.api-sports.io/football/leagues/39.png',
		type: 'League',
	});

	const handleLeagueChange = (selectedLeague: LeagueDto) => {
		if (league.pk === selectedLeague.pk) return;
		setLeague(selectedLeague);
	};

	// league.pk가 변경될 때마다 getRanking 재생성
	const getRanking = useCallback(async () => {
		const leaguePk = league.pk;
		const response =
			mode === 'season' ? await getActualSeasonRanking(leaguePk) : await getGambleSeasonRanking(leaguePk);
		setRanking(response?.data || null);
	}, [league.pk, mode]);

	// getRanking이 변경되면, 즉 league.pk가 변경되면 실행
	useEffect(() => {
		getRanking();
	}, [getRanking]);

	// 렌더링 초기 currentUserInfo가 null인 문제 해결
	useEffect(() => {
		if (currentUserInfo && currentUserInfo.league) {
			setLeague({
				pk: currentUserInfo?.league?.pk || 1,
				nameKr: currentUserInfo?.league?.nameKr || '프리미어리그',
				nameEn: currentUserInfo?.league?.nameEn || 'Premier League',
				logoUrl: currentUserInfo?.league?.logoUrl || 'https://media.api-sports.io/football/leagues/39.png',
				type: 'League',
			});
		}
	}, [currentUserInfo]);

	return (
		<ComponentFrame isMain={pathname === '/ranking'}>
			<div className="p-4 title5-semibold">{mode === 'season' ? '이번 시즌 순위' : '승부예측 순위'}</div>
			<div className="p-4 pl-2 border border-black-200 border-x-0 button4-medium">
				<SelectBox content={league.nameKr} onChange={handleLeagueChange} />
			</div>
			<div className="flex justify-between p-4 subtitle2-medium text-black-600">
				<div className="w-7 text-center">순위</div>
				<div className="flex gap-2">
					{mode === 'season' ? (
						<>
							<div className="w-7 text-center">경기</div>
							<div className="w-7 text-center">승점</div>
							<div className="w-7 text-center">득점</div>
						</>
					) : (
						<>
							<div className="w-7 text-center">경기</div>
							<div className="w-12 text-center">점수</div>
						</>
					)}
				</div>
			</div>
			<div className="p-4 pt-0">
				{!ranking || !ranking.length ? (
					<FetchingFailedCard onClick={getRanking} height="356px" marginTop="50px" />
				) : (
					ranking.map((item, rankOrder) => <RankingItem key={rankOrder} mode={mode} {...item} />)
				)}
			</div>
		</ComponentFrame>
	);
}
