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

	const selectedButtonClass = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:bg-primary-300 before:shadow-predict-button-active
		${side === 'left' && 'before:rounded-l-[0.5625rem]'} ${side === 'right' && 'before:rounded-r-[0.5625rem]'}`;

	const hoveredButtonClass = (
		side,
	) => `inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:hover:bg-primary-50 before:hover:shadow-predict-button-active before:transition-all
		${side === 'left' && 'before:rounded-l-[0.5625rem]'} ${side === 'right' && 'before:rounded-r-[0.5625rem]'}`;

	const updateScore = (side: 'left' | 'center' | 'right', mode: 'increase' | 'decrease') => {
		const change = mode === 'increase' ? +1 : -1;

		switch (side) {
			case 'left':
				setLeftScore(leftScore + change);
				break;
			case 'right':
				setRightScore(rightScore + change);
				break;
			case 'center':
				setLeftScore(leftScore + change);
				setRightScore(rightScore + change);
				break;
		}
	};

	const handleTeamButtonClick = (button: SelectedButton) => {
		// 선택이 완료된 상태에서 다시 클릭 시 득점 업다운 버튼 활성화
		if (isCompleted) {
			setIsCompleted(false);
			setIsClicked(true);
		} else {
			// 동일 버튼 클릭 시 선택 종료
			if (selectedButton === button) {
				setIsClicked(false);
				setLeftScore(0);
				setRightScore(0);
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
			updateScore('center', 'increase');
		} else {
			updateScore(side, 'increase');
		}
	};

	const handleDownButtonClick = (side: 'left' | 'right') => {
		if (selectedButton === 'center') {
			// 무승부 상태에서 버튼 클릭 시 양쪽을 1 감소
			updateScore('center', 'decrease');
		} else {
			updateScore(side, 'decrease');
		}
	};

	const handleCompleteButtonClick = () => {
		setIsClicked(false);
		setIsCompleted(true);
	};

	// TODO: data 매개변수로 받아서 뿌리기
	const renderTeamButton = (side: 'left' | 'right') => (
		<div
			onClick={() => handleTeamButtonClick(side)}
			className={clsx('relative h-full flex gap-2 items-center', {
				'pl-4 rounded-l-[0.5625rem]': side === 'left',
				'pr-4 justify-end text-right rounded-r-[0.5625rem]': side === 'right',
				[selectedButtonClass(side)]:
					(isClicked || isCompleted) && (side === 'left' ? leftScore > rightScore : leftScore < rightScore),
				[hoveredButtonClass(side)]: !(isClicked || isCompleted),
			})}
		>
			<Image className="relative z-20" width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
			<div>
				<div className="relative z-20">FC 서울</div>
				{isClicked && <div className="relative z-20 caption2-medium text-black-800">53%</div>}
			</div>
		</div>
	);

	return (
		<div className="flex flex-col gap-2.5 w-[36rem] cursor-pointer">
			<div className="relative w-full h-[4.625rem] grid grid-cols-3 border border-black-200 rounded-[0.625rem] button3-semibold shadow-predict-button">
				{/* 왼쪽 팀 */}
				{renderTeamButton('left')}

				{/* 중앙 (무승부) */}
				<div
					onClick={() => handleTeamButtonClick('center')}
					className={clsx('relative h-full flex flex-col justify-center items-center border-x border-black-200', {
						[selectedButtonClass('center')]: (isClicked || isCompleted) && leftScore === rightScore,
						[hoveredButtonClass('center')]: !(isClicked || isCompleted),
					})}
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
				{renderTeamButton('right')}
			</div>

			{/* 선택 완료 버튼 */}
			{isClicked && (
				<button
					onClick={handleCompleteButtonClick}
					className="w-full h-[1.875rem] border border-black-200 rounded-[0.625rem]
						flex justify-center items-center button5-medium shadow-predict-button transition-colors
						hover:bg-primary-700 hover:border-0 hover:shadow-kick-button-active active:bg-primary-900 active:text-white"
				>
					선택 완료
				</button>
			)}
		</div>
	);
}
