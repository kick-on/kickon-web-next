'use client';

import { useEffect, useState } from 'react';
import PredictCard from '@/components/features/home/predict-card';
import { GameDto } from '@/services/apis/game/game.type';
import useIsMobile from '@/lib/hooks/useIsMobile';
import AiAnalytics from '@/components/features/home/ai-analytics';
import clsx from 'clsx';
import GameComment from '@/components/features/home/game-comment';
import { getGames } from '@/services/apis/game/game.api';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

export default function Home() {
	const isMobile = useIsMobile();
	const [games, setGames] = useState<GameDto[]>([]);
	const [isError, setIsError] = useState(false);
	const { currentUserInfo } = useCurrentUserInfoStore();

	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	useEffect(() => {
		const fetchGames = async () => {
			try {
				const [proceedingRes, finishedRes] = await Promise.all([
					getGames({ league: 2, status: 'proceeding', team: undefined }),
					getGames({ league: 2, status: 'finished', team: undefined }),
				]);

				const proceedingGames = proceedingRes?.data.games ?? [];
				const finishedGames = finishedRes?.data.games ?? [];

				setGames([...proceedingGames, ...finishedGames]);
			} catch (error) {
				setIsError(true);
			}
		};

		fetchGames();
	}, [currentUserInfo]);

	// TODO: 경기가 없는 경우, 에러난 경우 처리 필요
	return (
		<div className="grid grid-cols-1 min-[120rem]:grid-cols-2 gap-6 pb-90">
			{/* 승부 예측 */}
			{games.length === 0 ? (
				<div
					className={clsx(
						'text-center text-subtitle-02 py-10 space-y-3 max-w-[41.75rem] bg-white rounded-lg border border-black-300',
						{
							'w-[41.75rem]': !isMobile,
						},
					)}
				>
					지금은 진행 중인 경기가 없어요.
				</div>
			) : (
				games.map((game) => (
					<div
						key={game.pk}
						className={clsx('py-4 space-y-3 max-w-[41.75rem] bg-white rounded-lg border border-black-300', {
							'w-[41.75rem]': !isMobile,
						})}
					>
						<PredictCard key={game.pk} type={game.homeScore !== null ? 'finished' : 'proceeding'} game={game} />
						{game.homeScore !== null && <AiAnalytics pk={game.pk} />}
						<GameComment pk={game.pk} />
					</div>
				))
			)}
		</div>
	);
}
