'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Score from '../../score';
import { useState } from 'react';

interface TeamButtonInfoDto {
	teamName: string;
	teamLogoUrl: string;
	gambleRatio: number;
	score?: number;
	isActive: boolean; // 팀 버튼 active 여부
	isScoreBoxActive?: boolean; // 점수 박스 active 여부
}

export default function TeamButton({ isMobile, isTablet, isClicked, isCompleted, onClick }) {
	const hoverShadowClass = (
		side,
	) => `inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
	before:content-[''] hover:before:bg-primary-50 hover:before:shadow-predict-button-active before:transition-all
	${side === 'home' && 'before:rounded-l-[0.5625rem]'} ${side === 'away' && 'before:rounded-r-[0.5625rem]'}`;

	const shadowClass50 = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:content-[''] before:bg-primary-50 before:shadow-predict-button-active
		${side === 'home' && 'before:rounded-l-[0.5625rem]'} ${side === 'away' && 'before:rounded-r-[0.5625rem]'}`;

	const shadowClass300 = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
			before:content-[''] before:bg-primary-300 before:shadow-predict-button-active
			${side === 'home' && 'before:rounded-l-[0.5625rem]'} ${side === 'away' && 'before:rounded-r-[0.5625rem]'}`;

	const isDesktop = !isMobile && !isTablet;

	const [leftScore, setLeftScore] = useState(0);
	const [rightScore, setRightScore] = useState(0);

	const home: TeamButtonInfoDto = {
		teamName: '',
		teamLogoUrl: '',
		gambleRatio: 0,
		score: leftScore,
		isActive: leftScore > rightScore,
		isScoreBoxActive: leftScore >= rightScore,
	};

	const draw: TeamButtonInfoDto = {
		teamName: '무승부',
		teamLogoUrl: undefined,
		gambleRatio: 0,
		isActive: leftScore === rightScore,
	};

	const away: TeamButtonInfoDto = {
		teamName: '',
		teamLogoUrl: '',
		gambleRatio: 0,
		score: rightScore,
		isActive: leftScore < rightScore,
		isScoreBoxActive: leftScore <= rightScore,
	};

	const sidesArr = ['home', 'draw', 'away'];
	const sides = {
		home,
		draw,
		away,
	};

	const handleTeamButtonClick = (side) => {
		if (side === 'home') {
			setLeftScore(1);
			setRightScore(0);
		} else if (side === 'draw') {
			setLeftScore(0);
			setRightScore(0);
		} else {
			setLeftScore(0);
			setRightScore(1);
		}

		onClick();
	};

	return (
		<div
			className={clsx(
				`relative w-full h-full min-h-[4.625rem] @mobile:min-h-[4.8125rem] grid grid-cols-3 items-center
				border border-black-200 shadow-predict-button transition-colors`,
				isClicked ? 'subtitle1-semibold' : 'button3-semibold',
				isMobile ? 'rounded-md' : 'rounded-lg',
			)}
		>
			{sidesArr.map((side) => (
				<div key={side} className={clsx('relative', isClicked && !isDesktop ? 'h-29' : 'h-full')}>
					<div
						onClick={() => handleTeamButtonClick(side)}
						className={clsx(
							'relative h-full flex gap-2 @mobile:min-h-[4.8125rem]',
							isClicked && !isDesktop ? 'pt-5 pb-4 items-start' : 'items-center',
							{
								// 데스크톱 태블릿 모바일 공통 스타일
								'flex-row-reverse text-right': side === 'away',
								'justify-center text-center border-x border-black-200': side === 'draw',
								// 데스크톱 스타일
								'pl-4 rounded-l-lg': side === 'home' && isDesktop,
								'pr-4 rounded-r-lg': side === 'away' && isDesktop,
								[hoverShadowClass(side)]: !(isClicked || isCompleted),
								[shadowClass300(side)]: (isClicked || isCompleted) && sides[side].isActive && isDesktop,
								// 태블릿 모바일 스타일
								'px-[1.875rem] @mobile:px-3': !isDesktop,
								'rounded-l-md': side === 'home' && isMobile,
								'rounded-r-md': side === 'away' && isMobile,
								[shadowClass50(side)]: (isClicked || isCompleted) && sides[side].isActive && !isDesktop,
							},
						)}
					>
						{side !== 'draw' ? (
							<Image
								className="relative z-20 w-[1.375rem] h-[1.375rem] object-contain"
								width={22}
								height={22}
								src={sides[side].teamLogoUrl}
								alt={`${sides[side].teamName} 로고 이미지`}
							/>
						) : (
							// 데스크톱에서 팀 버튼 클릭 시 또는
							// 승부예측 참여 완료 시 score 표시
							((isClicked && isDesktop) || isCompleted) && (
								<>
									<Score
										onClickUpButton={() => {}}
										onClickDownButton={() => {}}
										onChange={() => {}}
										side="left"
										score={leftScore}
										isCompleted={isCompleted}
										isActive={sides['home'].isScoreBoxActive}
									/>
									<Score
										onClickUpButton={() => {}}
										onClickDownButton={() => {}}
										onChange={() => {}}
										side="right"
										score={rightScore}
										isCompleted={isCompleted}
										isActive={sides['away'].isScoreBoxActive}
									/>
								</>
							)
						)}
						<div>
							<div className="relative z-20">{sides[side].teamName || '팀 이름'}</div>
							{isClicked && (
								<div className="relative z-20 caption2-medium text-black-800">{`${sides[side].gambleRatio}%`}</div>
							)}
						</div>
					</div>
					{isClicked && !isDesktop && side !== 'draw' && (
						<div
							className={clsx(
								'absolute bottom-4 @mobile:left-1/2 @mobile:-translate-x-1/2 z-20 w-13 h-9 flex rounded-md',
								side === 'home' ? 'left-[2.6875rem]' : 'right-[2.6875rem]',
								{
									'bg-black-500': !sides[side].isScoreBoxActive,
									'bg-primary-900': sides[side].isScoreBoxActive,
								},
							)}
						>
							<div
								className={clsx('m-auto px-1 text-black-000 body1-bold', {
									'bg-black-900': sides[side].isScoreBoxActive,
								})}
							>
								{sides[side].score}
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
