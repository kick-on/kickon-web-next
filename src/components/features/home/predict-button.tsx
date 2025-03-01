'use client';

import ComponentFrame from '@/components/common/componentFrame';
import Score from './score';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

type SelectedButton = 'none' | 'left' | 'center' | 'right';

export default function PredictButton() {
	const [isClicked, setIsClicked] = useState(false);
	const [leftScore, setLeftScore] = useState(0);
	const [rightScore, setRightScore] = useState(0);

	const selectedButton = !isClicked
		? 'none'
		: leftScore > rightScore
			? 'left'
			: leftScore === rightScore
				? 'center'
				: 'right';
	const selectedButtonClass = 'bg-primary-300 shadow-predict-button-active';

	const increaseScore = {
		left: () => setLeftScore(leftScore + 1),
		right: () => setRightScore(rightScore + 1),
		center: () => {
			setLeftScore(leftScore + 1);
			setRightScore(rightScore + 1);
		},
	};

	const decreaseScore = {
		left: () => setLeftScore(leftScore - 1),
		right: () => setRightScore(rightScore - 1),
		center: () => {
			setLeftScore(leftScore - 1);
			setRightScore(rightScore - 1);
		},
	};

	const handleTeamButtonClick = (button: SelectedButton) => {
		if (selectedButton === button) {
			setIsClicked(false);
			setLeftScore(0);
			setRightScore(0);
		} else {
			if (button === 'center') {
				const maxScore = Math.max(leftScore, rightScore);
				if (leftScore !== maxScore) {
					setLeftScore(maxScore);
				} else if (rightScore !== maxScore) {
					setRightScore(maxScore);
				}
			} else if (selectedButton === 'left' && button === 'right') {
				setRightScore(leftScore + 1);
			} else if (selectedButton === 'right' && button === 'left') {
				setLeftScore(rightScore + 1);
			} else {
				increaseScore[button]();
			}
			setIsClicked(true);
		}
	};

	const handleUpButtonClick = (side: 'left' | 'right') => {
		if (selectedButton === 'center') {
			increaseScore['center']();
		} else {
			increaseScore[side]();
		}
	};

	const handleDownButtonClick = (side: 'left' | 'right') => {
		if (selectedButton === 'center') {
			decreaseScore['center']();
		} else {
			decreaseScore[side]();
		}
	};

	return (
		<ComponentFrame isMain={true}>
			<div className="relative">
				{isClicked && (
					<div className="absolute top-1/2 left-1/2 -translate-1/2 z-10 pointer-events-none w-[36rem] h-[4.625rem] grid grid-cols-[1fr_11.9063rem_1fr]">
						<div
							className={clsx('h-full w-full rounded-l-[0.625rem]', {
								[selectedButtonClass]: leftScore > rightScore,
							})}
						></div>
						<div
							className={clsx('h-full w-full', {
								[selectedButtonClass]: leftScore === rightScore,
							})}
						></div>
						<div
							className={clsx('h-full w-full rounded-r-[0.625rem]', {
								[selectedButtonClass]: leftScore < rightScore,
							})}
						></div>
					</div>
				)}
				<div className="w-[36rem] h-[4.625rem] m-auto my-10 grid grid-cols-3 border border-black-300 rounded-[0.625rem] button3-semibold shadow-predict-button">
					<div
						onClick={() => handleTeamButtonClick('left')}
						className={clsx('pl-4 h-full flex gap-2 items-center rounded-l-[0.5625rem]')}
					>
						<Image className="relative z-20" width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
						<div>
							<div className="relative z-20">FC 서울</div>
							{isClicked && <div className="relative z-20 caption2-medium text-black-800">53%</div>}
						</div>
					</div>
					<div
						onClick={() => handleTeamButtonClick('center')}
						className={clsx('relative h-full flex flex-col justify-center items-center border-x border-black-300')}
					>
						{isClicked && (
							<div onClick={(e) => e.stopPropagation()}>
								<Score
									onClickUpButton={() => handleUpButtonClick('left')}
									onClickDownButton={() => handleDownButtonClick('left')}
									side="left"
									score={leftScore}
									isActive={leftScore >= rightScore}
								/>
								<Score
									onClickUpButton={() => handleUpButtonClick('right')}
									onClickDownButton={() => handleDownButtonClick('right')}
									side="right"
									score={rightScore}
									isActive={rightScore >= leftScore}
								/>
							</div>
						)}
						<div className="relative z-20">무승부</div>
						{isClicked && <div className="relative z-20 caption2-medium text-black-800">5%</div>}
					</div>
					<div
						onClick={() => handleTeamButtonClick('right')}
						className={clsx('pr-4 h-full flex gap-2 justify-end items-center text-right rounded-r-[0.5625rem]')}
					>
						<div>
							<div className="relative z-20">FC 서울</div>
							{isClicked && <div className="relative z-20 caption2-medium text-black-800">53%</div>}
						</div>
						<Image className="relative z-20" width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
					</div>
				</div>
			</div>
		</ComponentFrame>
	);
}
