'use client';

import clsx from 'clsx';
import UpDownButton from './up-down-button';
import { useEffect, useRef, useState } from 'react';

export default function Score({ side, initialScore }: { side: 'left' | 'right'; initialScore: number }) {
	const [score, setScore] = useState(initialScore);
	const downButtonRef = useRef<HTMLButtonElement | null>(null);

	const handleUpDownButtonClick = (direction: 'up' | 'down') => {
		const nextScore = direction === 'up' ? score + 1 : Math.max(0, score - 1);
		if (nextScore === score) return;
		setScore(nextScore);
	};

	useEffect(() => {
		if (!downButtonRef) return;
		if (score === 0) {
			downButtonRef.current.disabled = true;
		} else {
			downButtonRef.current.disabled = false;
		}
	}, [score]);

	return (
		<div
			className={clsx('absolute z-20 flex gap-2 items-center', {
				'-left-10': side === 'left',
				'flex-row-reverse -right-10': side === 'right',
			})}
		>
			<div className={clsx('flex flex-col gap-1.5')}>
				<UpDownButton onClick={() => handleUpDownButtonClick('up')} direction="up" />
				<UpDownButton ref={downButtonRef} onClick={() => handleUpDownButtonClick('down')} direction="down" />
			</div>
			<div className="w-8 h-8 flex justify-center items-center bg-primary-900 rounded-lg body1-bold text-black-000">
				{score}
			</div>
		</div>
	);
}
