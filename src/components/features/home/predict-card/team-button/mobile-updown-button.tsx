import clsx from 'clsx';
import Image from 'next/image';

export default function MobileUpdownButton({ score, onClickUpButton, onClickDownButton }) {
	const shadowClass = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:content-[''] before:bg-primary-50 before:shadow-predict-button-active
    before:opacity-0 active:before:opacity-100 before:transition-opacity
		${side === 'left' ? 'before:rounded-l-md' : 'before:rounded-r-md'}`;

	return (
		<div
			className="flex w-[calc(100%+1px)] h-12 absolute z-10 -bottom-14 -left-[1px]
      bg-black-000 border border-black-200 rounded-md shadow-predict-button"
		>
			<button
				onClick={onClickUpButton}
				disabled={score >= 20}
				className={clsx('group grow relative rounded-l-md flex justify-center items-center', shadowClass('left'))}
			>
				<Image className="group-disabled:opacity-[23%]" src={'/chevron/score-up.svg'} alt="+1" width={18} height={18} />
			</button>
			<div className="my-auto w-[1px] h-9 bg-black-200"></div>
			<button
				onClick={onClickDownButton}
				disabled={score <= 0}
				className={clsx('group grow relative rounded-r-md flex justify-center items-center', shadowClass('right'))}
			>
				<Image
					className="group-disabled:opacity-[23%]"
					src={'/chevron/score-down.svg'}
					alt="-1"
					width={18}
					height={18}
				/>
			</button>
		</div>
	);
}
