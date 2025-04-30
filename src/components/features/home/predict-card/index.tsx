'use client';

import clsx from 'clsx';
import InProgress from '../in-progress';
import Closed from '../closed';
import { GameDto } from '@/services/apis/user-game-gamble/dto';
import { formatGameStartDate } from '@/lib/utils/formatGameStartDate';
import { formatGambleParticipations } from '@/lib/utils/formatGambleParicipations';
import { getGameStartTimeBefore } from '@/lib/utils/getGameStartTimeBefore';
import ButtonTypeInProgress from '../button-type-in-progress';
import GameInfoBox, { GameInfoBoxProps } from './game-info-box';
import TeamButton from './team-button';
import ScoreButton from './score-button';
import CompleteButton from './complete-button';
import Header, { HeaderProps } from './header';
import getServerDeviceType from '@/lib/utils/getServerDeviceType';
import { useState } from 'react';

export default function PredictCard({
	game,
	type,
	leagueName,
	refetchGames,
}: {
	game: GameDto;
	type: 'proceeding' | 'finished';
	leagueName: string;
	refetchGames?: () => void;
}) {
	const { pk, homeTeam, awayTeam, gambleResult, myGambleResult, homeScore, awayScore, gameStatus, startAt } = game;

	const { isMobile, isTablet } = getServerDeviceType();

	const [isClicked, setIsClicked] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);

	const isFinished = type === 'finished';

	const [startDate, startTime] = formatGameStartDate(startAt);
	const participations = formatGambleParticipations(gambleResult.participationNumber);
	const timeBefore = getGameStartTimeBefore(startAt);

	const isGambleInProgress = type === 'proceeding'; // 예측 진행 중
	const isGameInProgress = type === 'finished' && (gameStatus === 'PENDING' || gameStatus === 'PROCEEDING'); // 경기 중
	const isGameCanceled = gameStatus === 'CANCELED' || gameStatus === 'POSTPONED';
	const isGameCompleted = gameStatus === 'HOME' || gameStatus === 'DRAW' || gameStatus === 'AWAY';

	const headerProps: HeaderProps = {
		leagueName,
		isGambleInProgress,
		isGameInProgress,
		isGameCanceled,
		startDate,
		startTime,
		timeBefore,
		myGambleResult,
	};

	const gameInfoBoxProps: GameInfoBoxProps = {
		isGambleInProgress,
		isGameInProgress,
		isGameCanceled,
		isGameCompleted,
		startDate,
		startTime,
	};

	return (
		<div
			className={`flex flex-col justify-center px-4 py-[1.375rem] min-h-[10.625rem]
				bg-black-000 rounded-lg overflow-hidden ${isFinished && !isGameInProgress ? 'text-black-700' : ''}`}
		>
			<Header {...headerProps} />
			<div className={clsx('grid grid-cols-[auto_1fr] grid-rows-[auto_auto]', { 'gap-x-1.5': !isMobile })}>
				{!isMobile ? <GameInfoBox {...gameInfoBoxProps} /> : <div></div>}
				<TeamButton
					onClick={() => setIsClicked(!isClicked)}
					game={game}
					isMobile={isMobile}
					isTablet={isTablet}
					isClicked={isClicked}
					isCompleted={false}
					isFinished={isFinished}
					isGameInProgress={isGambleInProgress}
				/>
				<div></div>
				{isClicked && (
					<div className={clsx('relative', isMobile || isTablet ? 'mt-22' : 'mt-4')}>
						{(isMobile || isTablet) && <ScoreButton />}
						<CompleteButton />
					</div>
				)}
			</div>
			<footer className="mt-2 caption1-regular text-black-700 text-right">{participations}명 참여</footer>
		</div>
	);
}
