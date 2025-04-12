import clsx from 'clsx';
import { ChangeEvent } from 'react';
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
	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className={clsx('absolute z-20 flex gap-2 items-center', {
				'-left-[2.625rem]': side === 'left',
				'flex-row-reverse -right-[2.625rem]': side === 'right',
			})}
		>
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
						className="hover:filter hover:brightness-0 hover:invert group-disabled:opacity-[23%]"
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
						className="hover:filter hover:brightness-0 hover:invert group-disabled:opacity-[23%]"
					/>
				</button>
			</div>

			<input
				disabled={isCompleted}
				type="text"
				value={score}
				onChange={(e) => onChange(e, side)}
				className={clsx('w-9 h-9 flex justify-center text-center rounded-lg body1-bold text-black-000', {
					'bg-primary-900': isActive,
					'bg-black-500': !isActive,
				})}
			/>
		</div>
	);
}
