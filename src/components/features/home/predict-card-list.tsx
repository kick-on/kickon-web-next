'use client';

import FetchingFailedCard from '@/components/common/fetching-failed-card';
import NoGameCard from '@/components/features/home/no-game-card';
import PredictCard from '@/components/features/home/predict-card';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getGames } from '@/services/apis/user-game-gamble';
import { GameTaggedLeagueDto, GetGamesRequest } from '@/services/apis/user-game-gamble/dto';
import { useCallback, useEffect, useState } from 'react';

export default function PredictCardList({ leaguePk }: { leaguePk: number }) {
	const { currentUserInfo } = useCurrentUserInfoStore();
	const [proceedingGames, setProceedingGames] = useState<GameTaggedLeagueDto | null>(null);
	const [finishedGames, setFinishedGames] = useState<GameTaggedLeagueDto | null>(null);
	const isProceedingGamesEmpty = proceedingGames && proceedingGames.games.length === 0;
	const isFinishedGamesEmpty = finishedGames && finishedGames.games.length === 0;

	const getGamesByStatus = useCallback(
		async (status: 'proceeding' | 'finished') => {
			const setter =
				status === 'proceeding' ? (value) => setProceedingGames(value) : (value) => setFinishedGames(value);

			const request: GetGamesRequest = {
				league: leaguePk,
				status: status,
			};
			const response = await getGames(request);

			if (!response) {
				setter(null);
			} else {
				console.log(response.data);
				setter(response.data);
			}
		},
		[leaguePk],
	);

	useEffect(() => {
		getGamesByStatus('proceeding');
		getGamesByStatus('finished');
	}, [currentUserInfo, getGamesByStatus]);
	return (
		<div className="flex flex-col gap-8">
			{/* 예측 진행 중 경기 */}
			{/* 예측 진행 중 경기와 예측 종료 경기가 모두 없는 경우 null */}
			{!(isProceedingGamesEmpty && isFinishedGamesEmpty) && (
				<div className="flex flex-col gap-4">
					{!proceedingGames ? (
						// 데이터 페칭에 실패한 경우 fetching failed card
						<div className="bg-black-000 rounded-[0.625rem] flex flex-col px-4 py-[1.375rem] ">
							<FetchingFailedCard
								onClick={() => getGamesByStatus('proceeding')}
								isCardVisible={false}
								height="8.25rem"
								marginTop="0"
							/>
						</div>
					) : // 예측 진행 중 경기가 없고, 예측 종료 경기는 있는 경우 no game card
					isProceedingGamesEmpty && !isFinishedGamesEmpty ? (
						<NoGameCard />
					) : (
						// 그 외에 정상적으로 predict card 렌더링
						<div>
							{proceedingGames.games.map((game, i) => (
								<div key={game.pk}>
									<PredictCard
										type={'proceeding'}
										leagueName={proceedingGames.league.nameKr || proceedingGames.league.nameEn}
										refetchGames={() => getGamesByStatus('proceeding')}
										game={game}
									/>
									{i !== proceedingGames.games.length - 1 && <hr className="mx-4 my-2 border-black-200" />}
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* 예측 종료 경기가 정상적으로 렌더링될 때에만 구분선 렌더링 */}
			{finishedGames && finishedGames.games.length > 0 && <hr className="mx-6 @mobile:mx-4 border-black-300" />}

			{/* 예측 종료 경기 */}
			{!finishedGames ? (
				// 데이터 페칭에 실패한 경우 fetching failed card
				<div className="bg-black-000 rounded-[0.625rem] flex flex-col px-4 py-[1.375rem] ">
					<FetchingFailedCard
						onClick={() => getGamesByStatus('finished')}
						isCardVisible={false}
						height="8.25rem"
						marginTop="0"
					/>
				</div>
			) : isProceedingGamesEmpty && isFinishedGamesEmpty ? (
				// 예측 진행 중 경기와 예측 종료 경기가 모두 없는 경우 no game card
				<NoGameCard />
			) : (
				//  그 외 정상적으로 predict card 렌더링
				<div>
					{finishedGames.games.map((game, i) => (
						<div key={game.pk}>
							<PredictCard
								type={'finished'}
								leagueName={finishedGames.league.nameKr || finishedGames.league.nameEn}
								game={game}
							/>
							{i !== finishedGames.games.length - 1 && <hr className="mx-4 my-2 border-black-200" />}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
