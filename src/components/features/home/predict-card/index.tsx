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
import { useState } from 'react';
import getServerDeviceType from '@/lib/utils/getServerDeviceType';

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

	const { isMobile, isTablet, isDesktop } = getServerDeviceType();

	const [selectedButton, setSelectedButton] = useState<string | null>(null);
	const [isClicked, setIsClicked] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

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

	const handleTeamButtonClick = (e: React.MouseEvent) => {
		const currentButton = (e.target as HTMLElement).closest('[id]').id;

		if (!isClicked) {
			// 참여 완료 상태에서 클릭 시 -> 수정 중 상태로 변경
			if (isCompleted) {
				setIsCompleted(false);
				setIsEditing(true);
			} else {
				setSelectedButton(currentButton);
			}
			setIsClicked(true);
			return;
		}

		// 클릭 상태에서 동일 버튼 클릭 시 -> 상태 초기화 & 필요 시 승부 예측 삭제
		if (isClicked && currentButton === selectedButton) {
			if (isEditing) {
				// TODO: 승부예측 삭제 api 연결
			}

			setSelectedButton(null);
			setIsCompleted(false);
			setIsEditing(false);
			setIsClicked(false);
			return;
		}

		// 클릭 상태에서 다른 버튼 클릭 시 -> selectedButton 업데이트
		if (isClicked && currentButton !== selectedButton) {
			setSelectedButton(currentButton);
			return;
		}
	};

	const handleCompleteButtonClick = () => {
		if (isEditing) {
			// TODO: 승부예측 수정 api 연결
			setIsEditing(false);
		} else {
			// TODO: 승부예측 생성 api 연결
		}

		if (isMobile) {
			setSelectedButton('home');
		}

		setIsClicked(false);
		setIsCompleted(true);
	};

	return (
		<div
			className={`flex flex-col justify-center px-4 py-[1.375rem] min-h-[10.625rem] max-w-[41.75rem]
				bg-black-000 rounded-lg overflow-hidden ${isFinished && !isGameInProgress ? 'text-black-700' : ''}`}
		>
			<Header {...headerProps} />
			<div className={clsx('grid grid-cols-[auto_1fr] grid-rows-[auto_auto]', { 'gap-x-1.5': !isMobile })}>
				{!isMobile ? <GameInfoBox {...gameInfoBoxProps} /> : <div></div>}
				<TeamButton
					onClick={handleTeamButtonClick}
					selectedButton={selectedButton}
					game={game}
					isMobile={isMobile}
					isTablet={isTablet}
					isClicked={isClicked}
					isCompleted={isCompleted}
					isEditing={isEditing}
					isFinished={isFinished}
					isGameInProgress={isGambleInProgress}
				/>
				<div></div>
				{isClicked && (
					<div className={clsx('relative', isMobile || isTablet ? 'mt-22' : 'mt-4')}>
						{(isMobile || isTablet) && <ScoreButton />}
						<CompleteButton onClick={handleCompleteButtonClick} />
					</div>
				)}
			</div>
			<footer className="mt-2 caption1-regular text-black-700 text-right">{participations}명 참여</footer>
		</div>
	);
}
