'use client';

import { useEffect, useState } from 'react';
import PredictCard from '@/components/features/home/predict-card';
import { GameTaggedLeagueDto } from '@/services/apis/game/game.type';
import useIsMobile from '@/lib/hooks/useIsMobile';
import AiAnalytics from '@/components/features/home/ai-analytics';
import clsx from 'clsx';
import GameComment from '@/components/features/home/game-comment';
import { getGames } from '@/services/apis/game/game.api';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import FloatingCalendarButton from '@/components/features/calendar/mobile-only/floating-calendar-button';
import CalendarPopover from '@/components/features/calendar/mobile-only/calendar-popover';

export default function Home() {
	const isMobile = useIsMobile();
	const [games, setGames] = useState<GameTaggedLeagueDto[]>([]);
	const [isError, setIsError] = useState(false);
	const { currentUserInfo } = useCurrentUserInfoStore();
	const [isCalendarModalOpen, setIsCalendarModlaOpen] = useState(false);

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
					getGames({ league: 1, status: 'proceeding', team: undefined }),
					getGames({ league: 1, status: 'finished', team: undefined }),
				]);

				const proceedingGames = proceedingRes?.data ?? [];
				const finishedGames = finishedRes?.data ?? [];

				setGames([...proceedingGames, ...finishedGames]);
			} catch (error) {
				setIsError(true);
			}
		};

		fetchGames();
	}, [currentUserInfo]);

	if (isError) {
		return (
			<div
				className={clsx(
					'text-center text-subtitle-02 py-10 space-y-3 max-w-[41.75rem] bg-white rounded-lg border border-black-300',
					{
						'w-[41.75rem]': !isMobile,
					},
				)}
			>
				<FetchingFailedCard height="" marginTop="" />
			</div>
		);
	}

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
				games.flatMap(({ league, games }) =>
					games.map((game) => (
						<div
							key={game.pk}
							className={clsx('py-4 space-y-3 max-w-[41.75rem] bg-white rounded-lg border border-black-300', {
								'w-[41.75rem]': !isMobile,
							})}
						>
							<PredictCard type={game.homeScore !== null ? 'finished' : 'proceeding'} league={league} game={game} />
							{game.homeScore !== null && <AiAnalytics pk={game.pk} />}
							<GameComment pk={game.pk} />
						</div>
					)),
				)
			)}
			<CalendarPopover isCalendarOpen={isCalendarModalOpen} onClose={() => setIsCalendarModlaOpen(false)} />
			<FloatingCalendarButton onClick={() => setIsCalendarModlaOpen((prev) => !prev)} />
		</div>
	);
}
