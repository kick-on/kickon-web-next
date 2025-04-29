'use client';

import { getAccessToken } from '@/lib/utils/getAccessToken';
import { deleteGameGamble, patchGameGamble, postGameGamble } from '@/services/apis/user-game-gamble';
import { GameDto, PatchGameGambleRequest, PostGameGambleRequest } from '@/services/apis/user-game-gamble/dto';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import ScoreButton from '../predict-card/score-button';

type SelectedButton = 'none' | 'left' | 'center' | 'right';

const clickedButtonClass = (side) =>
	`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
  before:content-[''] before:bg-primary-50 before:shadow-predict-button-active before:transition-all
  ${side === 'left' && 'before:rounded-l-md'} ${side === 'right' && 'before:rounded-r-md'}`;

const completedButtonClass = (
	side,
) => `inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
  before:content-[''] before:bg-primary-300 before:shadow-predict-button-active
  ${side === 'left' && 'before:rounded-l-md'} ${side === 'right' && 'before:rounded-r-md'}`;

export default function ButtonTypeInProgress({
	pk,
	homeTeam,
	awayTeam,
	gambleResult,
	myGambleResult,
	startDate,
	startTime,
	isGambleInProgress,
	isGameInProgress,
	isGameCanceled,
	gameStatusContent,
	refetchGames,
}: Pick<GameDto, 'pk' | 'homeTeam' | 'awayTeam' | 'gambleResult' | 'myGambleResult'> & {
	startDate: string;
	startTime: string;
	isGambleInProgress: boolean;
	isGameInProgress: boolean;
	isGameCanceled: boolean;
	gameStatusContent: string;
	refetchGames: () => void;
}) {
	const [isClicked, setIsClicked] = useState(false);
	const [isCompleted, setIsCompleted] = useState(!!myGambleResult);
	const [isEditing, setIsEditing] = useState(false);

	const [leftScore, setLeftScore] = useState(myGambleResult?.homeScore || 0);
	const [rightScore, setRightScore] = useState(myGambleResult?.awayScore || 0);

	const isTablet = true;

	const selectedButton = !isClicked
		? 'none'
		: leftScore > rightScore
			? 'left'
			: leftScore === rightScore
				? 'center'
				: 'right';

	const handleTeamButtonClick = async (button: SelectedButton) => {
		// 로그인 하지 않은 경우 사용 제한
		if (!getAccessToken()) {
			alert(`로그인이 필요한 서비스입니다.\n로그인 후 이용해 주세요.`);
			return;
		}

		// 선택이 완료된 상태에서 다시 클릭 시 득점 업다운 버튼 활성화
		if (isCompleted) {
			setIsCompleted(false);
			setIsEditing(true);
			setIsClicked(true);
		} else {
			// 동일 버튼 클릭 시 선택 종료
			if (selectedButton === button) {
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
				switch (button) {
					case 'left':
						setLeftScore(1);
						setRightScore(0);
						break;
					case 'center':
						setLeftScore(0);
						setRightScore(0);
						break;
					case 'right':
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

	const renderTeamButton = (side: 'left' | 'right') => {
		const isLeft = side === 'left';
		const isCurrentScoreActive = selectedButton === side || selectedButton === 'center';

		const teamName = isLeft ? homeTeam.nameKr || homeTeam.nameEn : awayTeam.nameKr || awayTeam.nameEn;
		const teamLogoUrl = isLeft ? homeTeam.logoUrl : awayTeam.logoUrl;
		const ratio = isLeft ? gambleResult.home : gambleResult.away;
		const score = isLeft ? leftScore : rightScore;

		return (
			<div
				onClick={() => handleTeamButtonClick(side)}
				className={clsx(
					'px-[1.875rem] @mobile:px-3 relative h-full flex flex-col justify-center',
					isClicked ? 'pt-5 pb-4' : 'min-h-[4.8125rem]',
					{
						'rounded-l-md': isLeft,
						'text-right rounded-r-md': !isLeft,
						[clickedButtonClass(side)]: isClicked && selectedButton === side,
						[completedButtonClass(side)]: isCompleted && (isLeft ? leftScore > rightScore : leftScore < rightScore),
					},
				)}
			>
				<div className={clsx('flex gap-1.5 items-center', { 'flex-row-reverse': !isLeft, 'mb-13': isClicked })}>
					<Image
						className="relative z-20 @mobile:w-4 @mobile:h-4 w-6 h-6 object-contain"
						width={isTablet ? 24 : 16}
						height={isTablet ? 24 : 16}
						src={teamLogoUrl}
						alt={`${teamName} 로고 이미지`}
					/>
					<div className="grow overflow-hidden">
						<div className="relative z-20 max-w-full min-w-0 max-h-8 whitespace-pre-line line-clamp-2 truncate">
							{teamName}
						</div>
						{isClicked && (
							<div className="relative z-20 button5-medium text-black-800 @mobile:text-10">{`${ratio}%`}</div>
						)}
					</div>
				</div>
				{isClicked && (
					<div
						className={clsx(
							'absolute bottom-4 @mobile:left-1/2 @mobile:-translate-x-1/2 z-20 w-13 h-9 flex rounded-md',
							isLeft ? 'left-[2.6875rem]' : 'right-[2.6875rem]',
							{
								'bg-black-500': isLeft ? leftScore < rightScore : leftScore > rightScore,
								'bg-primary-900': isLeft ? leftScore >= rightScore : leftScore <= rightScore,
							},
						)}
					>
						<div className={clsx('m-auto px-1 text-black-000 body1-bold', { 'bg-black-900': isCurrentScoreActive })}>
							{score}
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="grid grid-cols-[3.5625rem_1fr] grid-rows-[1fr_auto] w-full">
			{isTablet && (
				<div
					className={clsx(
						'relative z-20 -ml-1 w-[3.375rem] h-full flex flex-col justify-center items-center border rounded-[0.625rem] mb-auto',
						{
							'border-black-200 bg-black-000': isGambleInProgress || isGameInProgress,
							'bg-black-200 border-black-100': !isGambleInProgress && !isGameInProgress,
						},
					)}
				>
					<div className="body7-medium">{gameStatusContent}</div>
					<div className={clsx('button6-regular', { 'line-through': isGameCanceled })}>{startDate}</div>
					<div className={clsx('button6-regular', { 'line-through': isGameCanceled })}>{startTime}</div>
				</div>
			)}

			{/* <div className="flex flex-col grow cursor-pointer"> */}
			<div
				className="relative w-full h-fit grid grid-cols-3 button4-semibold 
        border border-black-200 rounded-md shadow-predict-button @mobile:text-12"
			>
				{/* 왼쪽 팀 */}
				{renderTeamButton('left')}

				{/* 중앙 (무승부) */}
				<div
					onClick={() => handleTeamButtonClick('center')}
					className={clsx(
						'relative h-full flex flex-col justify-center items-center border-x border-black-200',
						isClicked ? 'pt-5 pb-17' : 'min-h-[4.8125rem]',
						{
							[clickedButtonClass('center')]: isClicked && selectedButton === 'center',
							[completedButtonClass('center')]: isCompleted && leftScore === rightScore,
						},
					)}
				>
					<div className="relative z-20">무승부</div>
					{isClicked && (
						<div className="relative z-20 button5-medium text-black-800 @mobile:text-10">{gambleResult.draw}%</div>
					)}
				</div>

				{/* 오른쪽 팀 */}
				{renderTeamButton('right')}
			</div>

			<div></div>

			{isClicked && (
				<div className="relative">
					{/* score 버튼 */}
					<ScoreButton />

					{/* 선택 완료 버튼 */}
					<button
						onClick={handleCompleteButtonClick}
						className="w-full h-[2.125rem] mt-22 border border-black-200 rounded-md
						flex justify-center items-center button5-medium shadow-predict-button transition-colors
						hover:bg-primary-700 hover:border-0 hover:shadow-kick-button-active active:bg-primary-900 active:text-white"
					>
						선택 완료
					</button>
				</div>
			)}
		</div>
		// </div>
	);
}
