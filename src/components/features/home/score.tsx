'use client';

import clsx from 'clsx';
import { ChangeEvent, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Score({
	side,
	score,
	isActive,
	isCompleted,
	onClickUpButton,
	onClickDownButton,
	onChange,
}: {
	side: 'left' | 'right';
	score: number;
	isActive: boolean;
	isCompleted: boolean;
	onClickUpButton: () => void;
	onClickDownButton: () => void;
	onChange: (e: ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => void;
}) {
	const downButtonRef = useRef<HTMLButtonElement | null>(null);
	const upButtonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		if (!downButtonRef.current) return;
		if (score <= 0) {
			downButtonRef.current.disabled = true;
		} else {
			downButtonRef.current.disabled = false;
		}
		if (!upButtonRef.current) return;
		if (score >= 20) {
			upButtonRef.current.disabled = true;
		} else {
			upButtonRef.current.disabled = false;
		}
	}, [score]);

	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className={clsx('absolute z-20 flex gap-2 items-center', {
				'-left-10': side === 'left',
				'flex-row-reverse -right-10': side === 'right',
			})}
		>
			<div className={clsx('flex flex-col gap-1.5', { invisible: isCompleted })}>
				<button
					ref={upButtonRef}
					onClick={onClickUpButton}
					className="group w-4 h-4 rounded-xs bg-black-000 hover:bg-black-700 active:bg-black-900 shadow-score-button disabled:pointer-events-none"
				>
					<Image
						width={16}
						height={16}
						src={'/chevron/score-up.svg'}
						alt={'증가'}
						className="hover:filter hover:brightness-0 hover:invert group-disabled:opacity-[23%]"
					/>
				</button>
				<button
					ref={downButtonRef}
					onClick={onClickDownButton}
					className="group w-4 h-4 rounded-xs bg-black-000 hover:bg-black-700 active:bg-black-900 shadow-score-button disabled:pointer-events-none"
				>
					<Image
						width={16}
						height={16}
						src={'/chevron/score-down.svg'}
						alt={'감소'}
						className="hover:filter hover:brightness-0 hover:invert group-disabled:opacity-[23%]"
					/>
				</button>
			</div>

			<input
				type="text"
				value={score}
				onChange={(e) => onChange(e, side)}
				className={clsx('w-8 h-8 flex justify-center text-center rounded-lg body1-bold text-black-000', {
					'bg-primary-900': isActive,
					'bg-black-500': !isActive,
				})}
			/>
		</div>
	);
}
