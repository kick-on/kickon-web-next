'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Score from './score';
import { Dispatch, SetStateAction } from 'react';
import { GameDto } from '@/services/apis/user-game-gamble/dto';
import MobileUpdownButton from './mobile-updown-button';

interface TeamButtonInfoDto {
	teamName: string;
	teamLogoUrl: string;
	gambleRatio: number;
	score?: number;
	increaseScore?: () => void;
	decreaseScore?: () => void;
	isActive: boolean; // 팀 버튼 active 여부
	isScoreBoxActive?: boolean; // 점수 박스 active 여부
}

export interface TeamButtonProps {
	game: GameDto;
	isMobile: boolean;
	isTablet: boolean;
	isClicked: boolean;
	isCompleted: boolean;
	isEditing: boolean;
	isFinished: boolean;
	isGameInProgress: boolean;
	leftScore: number;
	rightScore: number;
	setLeftScore: Dispatch<SetStateAction<number>>;
	setRightScore: Dispatch<SetStateAction<number>>;
	selectedButton: string;
	onClick: (e: React.MouseEvent) => void;
}

export default function TeamButton({
	game,
	isMobile,
	isTablet,
	isClicked,
	isCompleted,
	isFinished,
	isGameInProgress,
	leftScore,
	rightScore,
	setLeftScore,
	setRightScore,
	selectedButton,
	onClick,
}: TeamButtonProps) {
	const isDesktop = !isMobile && !isTablet;

	const defaultFont = (() => {
		if (isMobile) return 'button5-semibold';
		if (isTablet) return 'button3-semibold';
		if (isDesktop) return 'button3-semibold';
	})();

	const clickedFont = (type: 'team' | 'ratio') => {
		if (isMobile) return type === 'team' ? 'button5-semibold' : 'caption2-medium';
		if (isTablet) return type === 'team' ? 'button4-semibold' : 'caption1-regular';
		if (isDesktop) return type === 'team' ? 'button4-semibold' : 'caption2-medium';
	};

	const hoverShadowClass = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:content-[''] hover:before:bg-primary-50 hover:before:shadow-predict-button-active before:transition-all
		${side === 'home' && (!isDesktop ? 'before:rounded-l-md' : 'before:rounded-l-lg')} 
		${side === 'away' && (!isDesktop ? 'before:rounded-r-md' : 'before:rounded-r-lg')}`;

	const activeShadowClass = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:content-[''] before:bg-primary-50 before:shadow-predict-button-active
		before:opacity-0 active:before:opacity-100 before:transition-all
		${side === 'home' && (!isDesktop ? 'before:rounded-l-md' : 'before:rounded-l-lg')} 
		${side === 'away' && (!isDesktop ? 'before:rounded-r-md' : 'before:rounded-r-lg')}`;

	const shadowClass300 = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:content-[''] before:bg-primary-300 before:shadow-predict-button-active
		${side === 'home' && (!isDesktop ? 'before:rounded-l-md' : 'before:rounded-l-lg')} 
		${side === 'away' && (!isDesktop ? 'before:rounded-r-md' : 'before:rounded-r-lg')}`;

	const bgClass200 = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:content-[''] before:bg-primary-200
		${side === 'home' && (!isDesktop ? 'before:rounded-l-md' : 'before:rounded-l-lg')} 
		${side === 'away' && (!isDesktop ? 'before:rounded-r-md' : 'before:rounded-r-lg')}`;

	const { homeTeam, awayTeam, gambleResult, myGambleResult } = game;

	const home: TeamButtonInfoDto = {
		teamName: homeTeam.nameKr || homeTeam.nameEn,
		teamLogoUrl: homeTeam.logoUrl,
		gambleRatio: gambleResult.home,
		score: leftScore,
		increaseScore: () => {
			// 무승부 선택 시 양쪽 점수 동시에 제어어
			if (selectedButton === 'draw') {
				setRightScore(rightScore + 1);
			}
			setLeftScore(leftScore + 1);
		},
		decreaseScore: () => {
			if (selectedButton === 'draw') {
				setRightScore(rightScore - 1);
			}
			setLeftScore(leftScore - 1);
		},
		isActive: leftScore > rightScore,
		isScoreBoxActive: leftScore >= rightScore,
	};

	const draw: TeamButtonInfoDto = {
		teamName: '무승부',
		teamLogoUrl: undefined,
		gambleRatio: gambleResult.draw,
		isActive: leftScore === rightScore,
	};

	const away: TeamButtonInfoDto = {
		teamName: awayTeam.nameKr || awayTeam.nameEn,
		teamLogoUrl: awayTeam.logoUrl,
		gambleRatio: gambleResult.away,
		score: rightScore,
		increaseScore: () => {
			if (selectedButton === 'draw') {
				setLeftScore(leftScore + 1);
			}
			setRightScore(rightScore + 1);
		},
		decreaseScore: () => {
			if (selectedButton === 'draw') {
				setLeftScore(leftScore - 1);
			}
			setRightScore(rightScore - 1);
		},
		isActive: leftScore < rightScore,
		isScoreBoxActive: leftScore <= rightScore,
	};

	const sidesArr = ['home', 'draw', 'away'];
	const sides = {
		home,
		draw,
		away,
	};

	const logoSize = (() => {
		if (isMobile) return 'w-4 h-4 min-w-4 min-h-4';
		if (isTablet)
			return isClicked ? 'w-6 h-6 min-w-6 min-h-6' : 'w-[1.375rem] h-[1.375rem] min-w-[1.375rem] min-h-[1.375rem]';
		if (isDesktop) return 'w-[1.375rem] h-[1.375rem] min-w-[1.375rem] min-h-[1.375rem]';
	})();

	return (
		<div
			className={clsx(
				`relative w-full h-full min-h-[4.625rem] @mobile:min-h-[4.8125rem] grid grid-cols-3 items-center
				border transition-colors`,
				isClicked || isFinished ? clickedFont('team') : defaultFont,
				!isDesktop ? 'rounded-md' : 'rounded-lg',
				{
					'bg-black-000 border-black-200 shadow-predict-button cursor-pointer': !isFinished,
					'pointer-events-none bg-black-000 border-black-200': isFinished && isGameInProgress,
					'cursor-pointer shadow-predict-button border-black-200': isFinished && !isGameInProgress,
				},
			)}
		>
			{sidesArr.map((side) => (
				<div key={side} id={side} className={clsx('relative', isClicked && !isDesktop ? 'h-29' : 'h-full')}>
					<div
						onClick={onClick}
						className={clsx('relative h-full flex gap-2 items-center @mobile:min-h-[4.8125rem]', {
							// 데스크톱 태블릿 모바일 공통 스타일
							'text-left': side === 'home',
							'flex-row-reverse text-right': side === 'away',
							'justify-center text-center border-x': side === 'draw',
							'border-black-200': side === 'draw' && (!isFinished || (isFinished && isGameInProgress)),
							'border-black-300': side === 'draw' && isFinished && !isGameInProgress,
							[bgClass200(side)]: isFinished && !isGameInProgress && myGambleResult && sides[side].isActive,
							[shadowClass300(side)]: sides[side].isActive && (isCompleted || isClicked),
							// 데스크톱 스타일
							'px-4 rounded-l-lg': side === 'home' && isDesktop,
							'px-4 rounded-r-lg': side === 'away' && isDesktop,
							[hoverShadowClass(side)]: !(isClicked || isCompleted) && isDesktop,
							// 태블릿 모바일 공통 스타일
							'pt-5 pb-17': isClicked && !isDesktop,
							'rounded-l-md': side === 'home' && isMobile,
							'rounded-r-md': side === 'away' && isMobile,
							[activeShadowClass(side)]: !(isClicked || isCompleted) && !isDesktop,
							// 태블릿 스타일
							'px-4 rounded-l-md': side === 'home' && isTablet,
							'px-4 rounded-r-md': side === 'away' && isTablet,
							'px-[1.975rem] rounded-l-md': side === 'home' && isTablet && isClicked,
							'px-[1.975rem] rounded-r-md': side === 'away' && isTablet && isClicked,
							// 모바일 스타일
							'px-3': isMobile,
						})}
					>
						{side !== 'draw' ? (
							// 팀 로고 이미지
							<div className={`relative z-20 ${logoSize}`}>
								<Image
									className="relative z-20 w-full h-full object-contain"
									fill
									src={sides[side].teamLogoUrl}
									alt={`${sides[side].teamName} 로고 이미지`}
								/>
							</div>
						) : (
							// 데스크톱에서 팀 버튼 클릭 시 또는
							// 승부예측 참여 완료 시 score box
							((isClicked && isDesktop) || isCompleted || isFinished) && (
								<>
									<Score
										onClickUpButton={sides.home.increaseScore}
										onClickDownButton={sides.home.decreaseScore}
										onChange={(e) => {
											const updatedScore = Math.min(20, Math.max(0, parseInt(e.target.value) || 0));
											setLeftScore(updatedScore);
										}}
										side="home"
										score={leftScore}
										isCompleted={isCompleted || isFinished}
										isActive={
											((isFinished && !isGameInProgress && myGambleResult) || !isFinished) &&
											sides.home.isScoreBoxActive
										}
									/>
									<Score
										onClickUpButton={sides.away.increaseScore}
										onClickDownButton={sides.away.decreaseScore}
										onChange={(e) => {
											const updatedScore = Math.min(20, Math.max(0, parseInt(e.target.value) || 0));
											setRightScore(updatedScore);
										}}
										side="away"
										score={rightScore}
										isCompleted={isCompleted || isFinished}
										isActive={
											((isFinished && !isGameInProgress && myGambleResult) || !isFinished) &&
											sides.away.isScoreBoxActive
										}
									/>
								</>
							)
						)}

						{/* 팀 이름 및 승부예측 비율 */}
						<div
							className={clsx('grow overflow-hidden', {
								// 데스크톱 태블릿 clicked 승부예측 카드 score box 크기 고려
								'pr-12': !isMobile && isClicked && side === 'home',
								'pl-12': !isMobile && isClicked && side === 'away',
								// 모바일 finish 승부예측 카드 score box 크기 고려
								'pr-1': isMobile && (isFinished || isCompleted) && side === 'home',
								'pl-1': isMobile && (isFinished || isCompleted) && side === 'away',
							})}
						>
							<div className="relative z-20 max-w-full min-w-0 max-h-8 whitespace-pre-line line-clamp-2 truncate">
								{sides[side].teamName || '팀 이름'}
							</div>
							{(isClicked || isFinished) && (
								<div
									className={`relative z-20 ${clickedFont('ratio')} ${!isFinished || isGameInProgress ? 'text-black-800' : ''}`}
								>{`${sides[side].gambleRatio}%`}</div>
							)}
						</div>
					</div>

					{/* 모바일에서 팀 버튼 클릭 시 score box */}
					{isClicked && !isDesktop && side !== 'draw' && (
						<div
							onClick={onClick}
							className={clsx(
								'absolute bottom-4 @mobile:left-1/2 @mobile:-translate-x-1/2 z-20 w-13 h-9 flex rounded-md',
								side === 'home' ? 'left-[2.6875rem]' : 'right-[2.6875rem]',
								{
									'bg-black-500': !sides[side].isScoreBoxActive,
									'bg-primary-900': sides[side].isScoreBoxActive,
								},
							)}
						>
							<div className="m-auto px-1 text-black-000 body1-bold">{sides[side].score}</div>
						</div>
					)}

					{/* 모바일 업다운 버튼 */}
					{side !== 'draw' && !isDesktop && isClicked && (
						<MobileUpdownButton
							score={sides[side].score}
							onClickUpButton={sides[side].increaseScore}
							onClickDownButton={sides[side].decreaseScore}
						/>
					)}
				</div>
			))}
		</div>
	);
}
