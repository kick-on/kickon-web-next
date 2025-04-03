'use client';

import FetchingFailedCard from '@/components/common/fetching-failed-card';
import RecommendedContent from '@/components/common/recommendedContent';
import PredictCard from '@/components/features/home/predict-card';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getGames } from '@/services/apis/user-game-gamble';
import { GameTaggedLeagueDto, GetGamesRequest } from '@/services/apis/user-game-gamble/dto';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();
	const [proceedingGames, setProceedingGames] = useState<GameTaggedLeagueDto | null>(null);
	const [finishedGames, setFinishedGames] = useState<GameTaggedLeagueDto | null>(null);

	const getGamesByStatus = useCallback(
		async (status: 'proceeding' | 'finished') => {
			const setter =
				status === 'proceeding' ? (value) => setProceedingGames(value) : (value) => setFinishedGames(value);

			const request: GetGamesRequest = {
				league: currentUserInfo?.leaguePk,
				status: status,
			};
			const response = await getGames(request);

			if (!response) {
				setter(null);
			} else {
				setter(response.data);
			}
		},
		[currentUserInfo?.leaguePk],
	);

	useEffect(() => {
		getGamesByStatus('proceeding');
		getGamesByStatus('finished');
	}, [currentUserInfo, currentUserInfo?.leagueName, getGamesByStatus]);

	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, [currentUserInfo, setCurrentUserInfo]);

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4">
				{!proceedingGames ? (
					<div className="w-[41.75rem] bg-black-000 rounded-[0.625rem] flex flex-col px-4 py-[1.375rem] ">
						<FetchingFailedCard
							onClick={() => getGamesByStatus('proceeding')}
							isCardVisible={false}
							height="8.25rem"
							marginTop="0"
						/>
					</div>
				) : (
					proceedingGames.games.map((game) => <PredictCard key={game.pk} leagueName={proceedingGames.name} {...game} />)
				)}
			</div>
			<hr className="mx-6 border-black-600" />
			<div className="flex flex-col gap-4">
				{!finishedGames ? (
					<div className="w-[41.75rem] bg-black-000 rounded-[0.625rem] flex flex-col px-4 py-[1.375rem] ">
						<FetchingFailedCard
							onClick={() => getGamesByStatus('finished')}
							isCardVisible={false}
							height="8.25rem"
							marginTop="0"
						/>
					</div>
				) : (
					finishedGames.games.map((game) => <PredictCard key={game.pk} leagueName={finishedGames.name} {...game} />)
				)}
			</div>
			<RecommendedContent mode={'뉴스'} />
			<RecommendedContent mode={'게시글'} />
		</div>
	);
}
