'use client';

import clsx from 'clsx';
import { GameDto, PatchGameGambleRequest, PostGameGambleRequest } from '@/services/apis/user-game-gamble/dto';
import { formatGameStartDate } from '@/lib/utils/formatGameStartDate';
import { formatGambleParticipations } from '@/lib/utils/formatGambleParicipations';
import { getGameStartTimeBefore } from '@/lib/utils/getGameStartTimeBefore';
import GameInfoBox, { GameInfoBoxProps } from './game-info-box';
import TeamButton from './team-button';
import CompleteButton from './complete-button';
import Header, { HeaderProps } from './header';
import { useState } from 'react';
import getServerDeviceType from '@/lib/utils/getServerDeviceType';
import { deleteGameGamble, patchGameGamble, postGameGamble } from '@/services/apis/user-game-gamble';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

export default function PredictCard({
	game,
	type,
	refetchGames,
}: {
	game: GameDto;
	type: 'proceeding' | 'finished';
	refetchGames?: () => void;
}) {
	const { pk, gambleResult, myGambleResult, homeScore, awayScore, gameStatus, startAt, league } = game;

	const { isMobile, isTablet } = getServerDeviceType();

	const isFinished = type === 'finished';

	const [startDate, startTime] = formatGameStartDate(startAt);
	const participations = formatGambleParticipations(gambleResult.participationNumber);
	const timeBefore = getGameStartTimeBefore(startAt);

	const isGambleInProgress = type === 'proceeding'; // 예측 진행 중
	const isGameInProgress = type === 'finished' && (gameStatus === 'PENDING' || gameStatus === 'PROCEEDING'); // 경기 중
	const isGameCanceled = gameStatus === 'CANCELED' || gameStatus === 'POSTPONED';
	const isGameCompleted = gameStatus === 'HOME' || gameStatus === 'DRAW' || gameStatus === 'AWAY';

	const [isClicked, setIsClicked] = useState(false);
	const [isCompleted, setIsCompleted] = useState(!!myGambleResult);
	const [isEditing, setIsEditing] = useState(false);

	const { currentUserInfo } = useCurrentUserInfoStore();

	// proceeding 카드: 내 예측 점수 또는 0으로 초기화
	// finished 카드: 실제 경기 득점 또는 경기 중이면 -1로 초기화
	const [leftScore, setLeftScore] = useState(
		(isFinished ? (isGameInProgress ? -1 : homeScore) : myGambleResult?.homeScore) || 0,
	);
	const [rightScore, setRightScore] = useState(
		(isFinished ? (isGameInProgress ? -1 : awayScore) : myGambleResult?.awayScore) || 0,
	);
	const selectedButton = !isClicked
		? 'none'
		: leftScore > rightScore
			? 'home'
			: leftScore === rightScore
				? 'draw'
				: 'away';

	const headerProps: HeaderProps = {
		leagueName: league.nameKr || league.nameEn,
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

	const handleTeamButtonClick = async (e) => {
		// 로그인 하지 않은 경우 사용 제한
		if (!currentUserInfo) {
			alert(`로그인이 필요한 서비스입니다.\n로그인 후 이용해 주세요.`);
			return;
		}

		const currentButton = (e.target as HTMLElement).closest('[id]').id;

		// 선택이 완료된 상태에서 다시 클릭 시 득점 업다운 버튼 활성화
		if (isCompleted) {
			setIsCompleted(false);
			setIsEditing(true);
			setIsClicked(true);
		} else {
			// 동일 버튼 클릭 시 선택 종료
			if (selectedButton === currentButton) {
				// 기존 예측이 있는 경우에는 예측 삭제
				if (myGambleResult) {
					const response = await deleteGameGamble(myGambleResult.id);
					console.log('delete', response);

					// 삭제 실패 시 현재 상태 유지
					if (typeof response === 'string') {
						console.error(response);
						return;
					}
				}
				setIsClicked(false);
				setIsCompleted(false);
				setIsEditing(false);
				setLeftScore(0);
				setRightScore(0);
				refetchGames();
			} else {
				switch (currentButton) {
					case 'home':
						setLeftScore(1);
						setRightScore(0);
						break;
					case 'draw':
						setLeftScore(0);
						setRightScore(0);
						break;
					case 'away':
						setLeftScore(0);
						setRightScore(1);
				}
				setIsClicked(true);
			}
		}
	};

	const handleCompleteButtonClick = async () => {
		if (isEditing) {
			// 수정 중인 상태에서는 patch 함수 호출
			const request: PatchGameGambleRequest = {
				gamble: myGambleResult?.id,
				predictedHomeScore: leftScore,
				predictedAwayScore: rightScore,
			};
			const response = await patchGameGamble(request);
			console.log('patch', response);

			if (typeof response === 'string') {
				console.error(response);
			} else {
				setIsClicked(false);
				setIsEditing(false);
				setIsCompleted(true);
				refetchGames();
			}
		} else {
			// 새로 생성하는 경우 post 함수 호출
			const request: PostGameGambleRequest = {
				game: pk,
				predictedHomeScore: leftScore,
				predictedAwayScore: rightScore,
			};
			const response = await postGameGamble(request);
			console.log('post', response);

			if (typeof response === 'string') {
				console.error(response);
			} else {
				setIsClicked(false);
				setIsCompleted(true);
				refetchGames();
			}
		}
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
					leftScore={leftScore}
					rightScore={rightScore}
					setLeftScore={setLeftScore}
					setRightScore={setRightScore}
					game={game}
					isMobile={isMobile}
					isTablet={isTablet}
					isClicked={isClicked}
					isCompleted={isCompleted}
					isEditing={isEditing}
					isFinished={isFinished}
					isGameInProgress={isGameInProgress}
				/>
				<div></div>
				{isClicked && (
					<div className={clsx('relative', isMobile || isTablet ? 'mt-22' : 'mt-4')}>
						<CompleteButton onClick={handleCompleteButtonClick} />
					</div>
				)}
			</div>

			<footer className="mt-2 caption1-regular text-black-700 text-right">{participations}명 참여</footer>
		</div>
	);
}
