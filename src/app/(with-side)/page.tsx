'use client';

import { useEffect, useState } from 'react';
import PredictCard from '@/components/features/home/predict-card';
import { GameDto } from '@/services/apis/game/game.type';
import useIsMobile from '@/lib/hooks/useIsMobile';
import AiAnalytics from '@/components/features/home/ai-analytics';
import clsx from 'clsx';
import GameComment from '@/components/features/home/game-comment';
import FloatingCalendarButton from '@/components/features/calendar/mobile-only/floating-calendar-button';
import CalendarPopover from '@/components/features/calendar/mobile-only/calendar-popover';

export default function Home() {
	const isMobile = useIsMobile();
	const [isCalendarModalOpen, setIsCalendarModlaOpen] = useState(false);

	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	// 여기서 경기 조회
	const games: GameDto[] = [
		{
			pk: 1,
			league: {
				pk: 1,
				nameKr: '프리미어리그',
				nameEn: 'Premier League',
				logoUrl: '/league-logo/premier-league.svg',
			},
			homeTeam: {
				pk: 1,
				nameKr: '아스널',
				nameEn: 'Arsenal',
				logoUrl: '/team-logo/arsenal.svg',
			},
			awayTeam: {
				pk: 2,
				nameKr: '첼시',
				nameEn: 'Chelsea',
				logoUrl: '/team-logo/chelsea.svg',
			},
			gambleResult: {
				home: 45,
				away: 30,
				draw: 25,
				participationNumber: 1250,
			},
			myGambleResult: null,
			homeScore: 2,
			awayScore: 1,
			round: '24',
			homePenaltyScore: null,
			awayPenaltyScore: null,
			gameStatus: 'HOME',
			startAt: '2026-02-04T20:00:00Z',
		},
		{
			pk: 2,
			league: {
				pk: 1,
				nameKr: '프리미어리그',
				nameEn: 'Premier League',
				logoUrl: '/league-logo/premier-league.svg',
			},
			homeTeam: {
				pk: 3,
				nameKr: '리버풀',
				nameEn: 'Liverpool',
				logoUrl: '/team-logo/liverpool.svg',
			},
			awayTeam: {
				pk: 4,
				nameKr: '맨시티',
				nameEn: 'Manchester City',
				logoUrl: '/team-logo/man-city.svg',
			},
			gambleResult: {
				home: 35,
				away: 40,
				draw: 25,
				participationNumber: 3420,
			},
			myGambleResult: {
				id: 'g1',
				homeScore: 1,
				awayScore: 2,
				result: 'AWAY',
				gambleStatus: 'SUCCEED',
			},
			homeScore: 1,
			awayScore: 2,
			round: '24',
			homePenaltyScore: null,
			awayPenaltyScore: null,
			gameStatus: 'AWAY',
			startAt: '2026-02-05T22:30:00Z',
		},
		{
			pk: 3,
			league: {
				pk: 2,
				nameKr: '라리가',
				nameEn: 'La Liga',
				logoUrl: '/league-logo/la-liga.svg',
			},
			homeTeam: {
				pk: 5,
				nameKr: '뉴캐슬',
				nameEn: 'Newcastle',
				logoUrl: '/team-logo/newcastle.svg',
			},
			awayTeam: {
				pk: 6,
				nameKr: '본머스',
				nameEn: 'Bournemouth',
				logoUrl: '/team-logo/bournemouth.svg',
			},
			gambleResult: {
				home: 60,
				away: 15,
				draw: 25,
				participationNumber: 840,
			},
			myGambleResult: null,
			homeScore: null,
			awayScore: null,
			round: '20',
			homePenaltyScore: null,
			awayPenaltyScore: null,
			gameStatus: 'PROCEEDING',
			startAt: '2026-02-06T19:00:00Z',
		},
	];

	return (
		<>
			<div className="grid grid-cols-1 min-[120rem]:grid-cols-2 gap-6 pb-90">
				{/* 승부 예측 */}
				{games.map((game) => (
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
				))}
			</div>

			<CalendarPopover isCalendarOpen={isCalendarModalOpen} onClose={() => setIsCalendarModlaOpen(false)} />

			<FloatingCalendarButton onClick={() => setIsCalendarModlaOpen((prev) => !prev)} />
		</>
	);
}
