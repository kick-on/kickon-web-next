'use client';

import FetchingFailedCard from '@/components/common/fetching-failed-card';
import RecommendedContent from '@/components/common/recommended-content';
import NoGameCard from '@/components/features/home/no-game-card';
import PredictCard from '@/components/features/home/predict-card';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getGames } from '@/services/apis/user-game-gamble';
import { GameTaggedLeagueDto, GetGamesRequest } from '@/services/apis/user-game-gamble/dto';
import { Suspense, useCallback, useEffect, useState } from 'react';

export default function Home() {
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
				league: currentUserInfo?.league?.pk || 1,
				status: status,
			};
			const response = await getGames(request);

			if (!response) {
				setter(null);
			} else {
				setter(response.data);
			}
		},
		[currentUserInfo?.league?.pk],
	);

	useEffect(() => {
		getGamesByStatus('proceeding');
		getGamesByStatus('finished');
	}, [currentUserInfo, getGamesByStatus]);

	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	return (
		<div className="flex flex-col gap-8 @mobile:gap-5">
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
						proceedingGames.games.map((game) => (
							<PredictCard
								key={game.pk}
								type={'proceeding'}
								leagueName={proceedingGames.league.nameKr || proceedingGames.league.nameEn}
								refetchGames={() => getGamesByStatus('proceeding')}
								game={game}
							/>
						))
					)}
				</div>
			)}

			{/* 예측 종료 경기가 정상적으로 렌더링될 때에만 구분선 렌더링 */}
			{finishedGames && finishedGames.games.length > 0 && <hr className="mx-6 @mobile:mx-4 border-black-600" />}

			{/* 예측 종료 경기 */}
			<div className="flex flex-col gap-4">
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
					finishedGames.games.map((game) => (
						<PredictCard
							key={game.pk}
							type={'finished'}
							leagueName={finishedGames.league.nameKr || finishedGames.league.nameEn}
							game={game}
						/>
					))
				)}

				{/* 추천 뉴스 및 게시글 */}
				<Suspense>
					<RecommendedContent
						mode={'news'}
						teamLogo={currentUserInfo?.favoriteTeams[0]?.logoUrl}
						teamName={
							currentUserInfo?.favoriteTeams[0]?.nameKr || currentUserInfo?.favoriteTeams[0]?.nameEn || undefined
						}
					/>
					<RecommendedContent mode={'board'} />
				</Suspense>
			</div>
		</div>
	);
}
