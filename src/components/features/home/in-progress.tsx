'use client';

import Score from './score';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import clsx from 'clsx';

type SelectedButton = 'none' | 'left' | 'center' | 'right';

export default function InProgress() {
	const [isClicked, setIsClicked] = useState(false);
	const [leftScore, setLeftScore] = useState(0);
	const [rightScore, setRightScore] = useState(0);
	const [isCompleted, setIsCompleted] = useState(false);

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
		if (isCompleted) {
			// 선택이 완료된 상태에서 다시 클릭 시 득점 업다운 버튼 활성화
			setIsCompleted(false);
			setIsClicked(true);
		} else {
			if (selectedButton === button) {
				// 동일 버튼 클릭 시 선택 종료
				setIsClicked(false);
				setLeftScore(0);
				setRightScore(0);
			} else {
				if (button === 'center') {
					// 무승부 버튼 클릭 시 더 큰 값에 동기화
					if (leftScore > rightScore) {
						setRightScore(leftScore);
					} else {
						setLeftScore(rightScore);
					}
				} else if (button === 'right') {
					// leftScore > rightScore 상태에서 오른쪽 팀 버튼 클릭 시
					// rightScore = leftScore + 1
					setRightScore(leftScore + 1);
				} else if (button === 'left') {
					// rightScore > leftScore 상태에서 왼쪽 팀 버튼 클릭 시
					// leftScore = rightScore + 1
					setLeftScore(rightScore + 1);
				} else {
					// 그 외에는 한쪽을 1 증가하거나 양쪽을 1 증가
					increaseScore[button]();
				}
				setIsClicked(true);
			}
		}
	};

	const handleScoreChange = (e: ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
		if (isNaN(Number(e.target.value))) return;
		if (Number(e.target.value) > 20) {
			if (side === 'left') {
				setLeftScore(20);
			} else {
				setRightScore(20);
			}
			return;
		}
		if (side === 'left') {
			setLeftScore(Number(e.target.value));
		} else {
			setRightScore(Number(e.target.value));
		}
	};

	const handleUpButtonClick = (side: 'left' | 'right') => {
		if (selectedButton === 'center') {
			// 무승부 상태에서 버튼 클릭 시 양쪽을 1 증가
			increaseScore['center']();
		} else {
			increaseScore[side]();
		}
	};

	const handleDownButtonClick = (side: 'left' | 'right') => {
		if (selectedButton === 'center') {
			// 무승부 상태에서 버튼 클릭 시 양쪽을 1 감소
			decreaseScore['center']();
		} else {
			decreaseScore[side]();
		}
	};

	const handleCompleteButtonClick = () => {
		setIsClicked(false);
		setIsCompleted(true);
	};

	return (
		<div className="flex flex-col gap-2.5 w-[36rem] cursor-pointer">
			{/* 팀 선택 버튼 */}
			<div className="relative w-full h-[4.625rem] grid grid-cols-3 border border-black-200 rounded-[0.625rem] button3-semibold shadow-predict-button">
				{/* 선택한 팀 표시 */}
				{(isClicked || isCompleted) && (
					<div className="absolute pointer-events-none top-1/2 left-1/2 -translate-1/2 z-10 w-full h-[4.625rem] grid grid-cols-[1fr_11.9063rem_1fr]">
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

				{/* 왼쪽 팀 */}
				<div
					onClick={() => handleTeamButtonClick('left')}
					className="pl-4 h-full flex gap-2 items-center rounded-l-[0.5625rem]"
				>
					<Image className="relative z-20" width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
					<div>
						<div className="relative z-20">FC 서울</div>
						{isClicked && <div className="relative z-20 caption2-medium text-black-800">53%</div>}
					</div>
				</div>

				{/* 중앙 (무승부) */}
				<div
					onClick={() => handleTeamButtonClick('center')}
					className="relative h-full flex flex-col justify-center items-center border-x border-black-200"
				>
					{(isClicked || isCompleted) && (
						<>
							<Score
								onClickUpButton={() => handleUpButtonClick('left')}
								onClickDownButton={() => handleDownButtonClick('left')}
								onChange={handleScoreChange}
								side="left"
								score={leftScore}
								isCompleted={isCompleted}
								isActive={leftScore >= rightScore}
							/>
							<Score
								onClickUpButton={() => handleUpButtonClick('right')}
								onClickDownButton={() => handleDownButtonClick('right')}
								onChange={handleScoreChange}
								side="right"
								score={rightScore}
								isCompleted={isCompleted}
								isActive={rightScore >= leftScore}
							/>
						</>
					)}
					<div className="relative z-20">무승부</div>
					{isClicked && <div className="relative z-20 caption2-medium text-black-800">5%</div>}
				</div>

				{/* 오른쪽 팀 */}
				<div
					onClick={() => handleTeamButtonClick('right')}
					className="pr-4 h-full flex gap-2 justify-end items-center text-right rounded-r-[0.5625rem]"
				>
					<div>
						<div className="relative z-20">FC 서울</div>
						{isClicked && <div className="relative z-20 caption2-medium text-black-800">53%</div>}
					</div>
					<Image className="relative z-20" width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
				</div>
			</div>

			{/* 선택 완료 버튼 */}
			{isClicked && (
				<button
					onClick={handleCompleteButtonClick}
					className="w-full h-[1.875rem] border border-black-200 rounded-[0.625rem]
				flex justify-center items-center button5-medium shadow-predict-button
				hover:bg-primary-700 hover:border-0 active:bg-primary-900 active:text-white"
				>
					선택 완료
				</button>
			)}
		</div>
	);
}
