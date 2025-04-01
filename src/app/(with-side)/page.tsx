'use client';

import FetchingFailedCard from '@/components/common/fetching-failed-card';
import RecommendedContent from '@/components/common/recommendedContent';
import PredictCard from '@/components/features/home/predict-card';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getGames } from '@/services/apis/user-game-gamble';
import { GameTaggedLeagueDto, GetGamesRequest } from '@/services/apis/user-game-gamble/dto';
import { getUserInfo } from '@/services/auth';
import { useEffect, useState } from 'react';

export default function Home() {
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();
	const [proceedingGames, setProceedingGames] = useState<GameTaggedLeagueDto | null>(null);
	const [finishedGames, setFinishedGames] = useState<GameTaggedLeagueDto | null>(null);

	useEffect(() => {
		const getGamesByStatus = async (status: 'proceeding' | 'finished') => {
			const setter =
				status === 'proceeding' ? (value) => setProceedingGames(value) : (value) => setFinishedGames(value);
			// TODO: 백엔드에서 league pk 넣어줘야 연결 가능
			// TODO: 카테고리탭 리그 선택 연결하기
			const request: GetGamesRequest = {
				league: 1,
				season: 2024,
				status: status,
			};
			const response = await getGames(request);
			console.log(response);

			if (!response) {
				setter(null);
			} else {
				setter(response.data);
			}
		};

		getGamesByStatus('proceeding');
		getGamesByStatus('finished');
	}, [currentUserInfo, currentUserInfo?.leagueName]);

	useEffect(() => {
		// 저장된 유저 정보가 없으면 jwt 기반으로 유저 정보 불러와 전역 상태 관리
		if (!currentUserInfo) {
			const getCurrentUserInfo = async () => {
				const response = await getUserInfo();

				if (typeof response === 'string') {
					console.log(response);
				} else {
					setCurrentUserInfo(response.data);
				}
			};

			getCurrentUserInfo();
		}

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
						<FetchingFailedCard isCardVisible={false} height="8.25rem" marginTop="0" />
					</div>
				) : (
					proceedingGames.games.map((game) => <PredictCard key={game.pk} leagueName={proceedingGames.name} {...game} />)
				)}
			</div>
			<hr className="mx-6 border-black-600" />
			<div className="flex flex-col gap-4">
				{!finishedGames ? (
					<div className="w-[41.75rem] bg-black-000 rounded-[0.625rem] flex flex-col px-4 py-[1.375rem] ">
						<FetchingFailedCard isCardVisible={false} height="8.25rem" marginTop="0" />
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
