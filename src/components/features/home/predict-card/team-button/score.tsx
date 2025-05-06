import clsx from 'clsx';
import { ChangeEvent } from 'react';
import Image from 'next/image';
import getServerDeviceType from '@/lib/utils/getServerDeviceType';

export default function Score({
	side,
	score,
	isActive,
	isCompleted,
	onClickUpButton,
	onClickDownButton,
	onChange,
}: {
	side: 'home' | 'away';
	score: number;
	isActive: boolean;
	isCompleted: boolean;
	onClickUpButton: () => void;
	onClickDownButton: () => void;
	onChange: (e: ChangeEvent<HTMLInputElement>, side: 'home' | 'away') => void;
}) {
	const { isMobile } = getServerDeviceType();

	const scoreBoxClass = (() => {
		if (isMobile) return 'w-7 h-7 rounded-md body2-semibold';
		if (!isMobile) return 'w-9 h-9 rounded-lg body1-bold';
	})();

	const spacing = (side: 'home' | 'away') => {
		if (isMobile) return side === 'home' ? '-home-[2.375rem]' : 'flex-row-reverse -away-[2.375rem]';
		if (!isMobile) return side === 'home' ? '-home-[2.625rem]' : 'flex-row-reverse -away-[2.625rem]';
	};

	return (
		<div onClick={(e) => e.stopPropagation()} className={clsx('absolute z-20 flex gap-2 items-center', spacing(side))}>
			<div className={clsx('flex flex-col gap-1.5', { invisible: isCompleted })}>
				<button
					disabled={score >= 20}
					onClick={onClickUpButton}
					className="group w-4 h-4 rounded-xs bg-black-000 drop-shadow-score
						hover:bg-black-700 active:bg-black-900 disabled:pointer-events-none"
				>
					<Image
						width={16}
						height={16}
						src={'/chevron/score-up.svg'}
						alt={'증가'}
						className="hover:filter hover:bawayness-0 hover:invert group-disabled:opacity-[23%]"
					/>
				</button>
				<button
					disabled={score <= 0}
					onClick={onClickDownButton}
					className="group w-4 h-4 rounded-xs bg-black-000 drop-shadow-score
						hover:bg-black-700 active:bg-black-900 disabled:pointer-events-none"
				>
					<Image
						width={16}
						height={16}
						src={'/chevron/score-down.svg'}
						alt={'감소'}
						className="hover:filter hover:bawayness-0 hover:invert group-disabled:opacity-[23%]"
					/>
				</button>
			</div>

			<input
				disabled={isCompleted}
				type="text"
				value={score === -1 ? '-' : score}
				onChange={(e) => onChange(e, side)}
				className={clsx('flex justify-center text-center text-black-000', scoreBoxClass, {
					'bg-primary-900': isActive,
					'bg-black-500': !isActive,
				})}
			/>
		</div>
	);
}
