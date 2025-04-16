'use client';

import ComponentFrame from '@/components/common/componentFrame';
import RankingItem from './ranking-item';
import SelectBox from './select-box';
import { getActualSeasonRanking, getGambleSeasonRanking } from '@/services/apis/ranking';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import { LeagueDto } from '@/services/apis/league/dto';
import { useCallback, useEffect, useState } from 'react';
import { ActualRankingDto, GambleRankingDto } from '@/services/apis/ranking/dto';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

export default function RankingList({ mode }: { mode: 'season' | 'predict' }) {
	const { currentUserInfo } = useCurrentUserInfoStore();

	const [ranking, setRanking] = useState<GambleRankingDto[] | ActualRankingDto[] | null>();
	const [league, setLeague] = useState<LeagueDto>({
		pk: 1,
		nameKr: '프리미어리그',
		nameEn: 'Premier League',
		logoUrl: 'https://media.api-sports.io/football/leagues/39.png',
		leagueType: 'League',
	});

	// 렌더링 초기 currentUserInfo가 null인 문제 해결
	useEffect(() => {
		if (currentUserInfo) {
			setLeague({
				pk: currentUserInfo?.leaguePk,
				nameKr: currentUserInfo?.leagueName,
				nameEn: currentUserInfo?.leagueName,
				logoUrl: currentUserInfo?.leagueLogoUrl,
				leagueType: 'League',
			});
		}
	}, [currentUserInfo]);

	const handleLeagueChange = (selectedLeague: LeagueDto) => {
		if (league.pk === selectedLeague.pk) return;
		setLeague(selectedLeague);
	};

	const getRanking = useCallback(async () => {
		const leaguePk = league.pk;
		const response =
			mode === 'season' ? await getActualSeasonRanking(leaguePk) : await getGambleSeasonRanking(leaguePk);
		setRanking(response?.data || null);
		console.log(response);
	}, [league.pk, mode]);

	useEffect(() => {
		getRanking();
	}, [getRanking]);

	return (
		<ComponentFrame>
			<div className="p-4 title5-semibold">{mode === 'season' ? '이번 시즌 순위' : '승부예측 순위'}</div>
			<div className="p-4 pl-2 border border-black-200 border-x-0 button4-medium">
				<SelectBox content={league.nameKr} onChange={handleLeagueChange} />
			</div>
			<div className="flex justify-between p-4 subtitle2-medium text-black-700">
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
