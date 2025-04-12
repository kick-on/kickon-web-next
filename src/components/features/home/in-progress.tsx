'use client';

import Score from './score';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import clsx from 'clsx';
import { GameDto, PatchGameGambleRequest, PostGameGambleRequest } from '@/services/apis/user-game-gamble/dto';
import { deleteGameGamble, patchGameGamble, postGameGamble } from '@/services/apis/user-game-gamble';
import { getAccessToken } from '@/lib/utils/getAccessToken';

type SelectedButton = 'none' | 'left' | 'center' | 'right';

export default function InProgress({
	pk,
	homeTeam,
	awayTeam,
	gambleResult,
	myGambleResult,
	refetchGames,
}: Pick<GameDto, 'pk' | 'homeTeam' | 'awayTeam' | 'gambleResult' | 'myGambleResult'> & { refetchGames: () => void }) {
	const [isClicked, setIsClicked] = useState(false);
	const [isCompleted, setIsCompleted] = useState(!!myGambleResult);
	const [isEditing, setIsEditing] = useState(false);

	const [leftScore, setLeftScore] = useState(myGambleResult?.homeScore || 0);
	const [rightScore, setRightScore] = useState(myGambleResult?.awayScore || 0);

	const selectedButton = !isClicked
		? 'none'
		: leftScore > rightScore
			? 'left'
			: leftScore === rightScore
				? 'center'
				: 'right';

	const selectedButtonClass = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:content-[''] before:bg-primary-300 before:shadow-predict-button-active
		${side === 'left' && 'before:rounded-l-[0.5625rem]'} ${side === 'right' && 'before:rounded-r-[0.5625rem]'}`;

	const hoveredButtonClass = (
		side,
	) => `inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:content-[''] hover:before:bg-primary-50 hover:before:shadow-predict-button-active before:transition-all
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
		const teamName = isLeft ? homeTeam.name : awayTeam.name;
		const teamLogoUrl = isLeft ? homeTeam.logoUrl : awayTeam.logoUrl;
		const ratio = isLeft ? gambleResult.home : gambleResult.away;

		return (
			<div
				onClick={() => handleTeamButtonClick(side)}
				className={clsx('relative h-full flex gap-2 items-center', {
					'pl-4 rounded-l-[0.5625rem]': isLeft,
					'pr-4 flex-row-reverse text-right rounded-r-[0.5625rem]': !isLeft,
					[selectedButtonClass(side)]:
						(isClicked || isCompleted) && (isLeft ? leftScore > rightScore : leftScore < rightScore),
					[hoveredButtonClass(side)]: !(isClicked || isCompleted),
				})}
			>
				<Image
					className="relative z-20 w-[1.375rem] h-[1.375rem] object-contain"
					width={22}
					height={22}
					src={teamLogoUrl}
					alt={`${teamName} 로고 이미지`}
				/>
				<div>
					<div className="relative z-20">{teamName || '팀 이름'}</div>
					{isClicked && <div className="relative z-20 caption2-medium text-black-800">{`${ratio}%`}</div>}
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-4 w-[36rem] cursor-pointer">
			<div
				className={clsx(
					'relative w-full h-[4.625rem] grid grid-cols-3 border border-black-200 rounded-[0.625rem] shadow-predict-button',
					isClicked ? 'subtitle1-semibold' : 'button3-semibold',
				)}
			>
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
					{isClicked && <div className="relative z-20 caption2-medium text-black-800">{gambleResult.draw}%</div>}
				</div>

				{/* 오른쪽 팀 */}
				{renderTeamButton('right')}
			</div>

			{/* 선택 완료 버튼 */}
			{isClicked && (
				<button
					onClick={handleCompleteButtonClick}
					className="w-full h-[2.125rem] border border-black-200 rounded-md
						flex justify-center items-center button5-medium shadow-predict-button transition-colors
						hover:bg-primary-700 hover:border-0 hover:shadow-kick-button-active active:bg-primary-900 active:text-white"
				>
					선택 완료
				</button>
			)}
		</div>
	);
}
