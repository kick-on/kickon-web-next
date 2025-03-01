'use client';

import ComponentFrame from '@/components/common/componentFrame';
import Score from './score/score';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

type SelectedButton = 'none' | 'left' | 'center' | 'right';

export default function PredictButton() {
	const [selectedButton, setSelectedButton] = useState<SelectedButton>('none');
	const selectedButtonClass = 'bg-primary-300 shadow-predict-button-active';
	const isClicked = selectedButton !== 'none';

	const handleButtonClick = (button: SelectedButton) => {
		if (selectedButton === button) {
			setSelectedButton('none');
		} else {
			setSelectedButton(button);
		}
	};

	return (
		<ComponentFrame isMain={true}>
			<div className="relative">
				<div className="absolute top-1/2 left-1/2 -translate-1/2 z-10 pointer-events-none w-[36rem] h-[4.625rem] grid grid-cols-[1fr_11.9063rem_1fr]">
					<div
						className={clsx('h-full w-full rounded-l-[0.625rem]', {
							[selectedButtonClass]: selectedButton === 'left',
						})}
					></div>
					<div
						className={clsx('h-full w-full', {
							[selectedButtonClass]: selectedButton === 'center',
						})}
					></div>
					<div
						className={clsx('h-full w-full rounded-r-[0.625rem]', {
							[selectedButtonClass]: selectedButton === 'right',
						})}
					></div>
				</div>
				<div className="w-[36rem] h-[4.625rem] m-auto my-10 grid grid-cols-3 border border-black-300 rounded-[0.625rem] button3-semibold shadow-predict-button">
					<div
						onClick={() => handleButtonClick('left')}
						className={clsx('pl-4 h-full flex gap-2 items-center rounded-l-[0.5625rem]')}
					>
						<Image className="relative z-20" width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
						<div>
							<div className="relative z-20">FC 서울</div>
							{isClicked && <div className="relative z-20 caption2-medium text-black-800">53%</div>}
						</div>
					</div>
					<div
						onClick={() => handleButtonClick('center')}
						className={clsx('relative h-full flex flex-col justify-center items-center border-x border-black-300')}
					>
						{isClicked && (
							<div onClick={(e) => e.stopPropagation()}>
								<Score side="left" initialScore={selectedButton === 'left' ? 1 : 0} />
								<Score side="right" initialScore={selectedButton === 'right' ? 1 : 0} />
							</div>
						)}
						<div className="relative z-20">무승부</div>
						{isClicked && <div className="relative z-20 caption2-medium text-black-800">5%</div>}
					</div>
					<div
						onClick={() => handleButtonClick('right')}
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
