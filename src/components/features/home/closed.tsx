import Image from 'next/image';
import clsx from 'clsx';

export default function Closed({ isParticipated }: { isParticipated: boolean }) {
	const leftScore = 2 as number;
	const rightScore = 1 as number;

	const selectedButtonClass = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:bg-primary-200 before:shadow-closed-button-active
		${side === 'left' ? 'before:rounded-l-[0.5625rem]' : side === 'right' ? 'before:rounded-r-[0.5625rem]' : ''}`;

	return (
		<div className="w-[36rem] h-[4.625rem] grid grid-cols-3 bg-black-200 border border-black-300 rounded-[0.625rem] button3-semibold text-black-700">
			<div
				className={clsx('relative pl-4 h-full flex gap-2 items-center rounded-l-[0.5625rem]', {
					[selectedButtonClass('left')]: isParticipated && leftScore > rightScore,
				})}
			>
				<Image className="relative z-20" width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
				<div>
					<div className="relative z-20">FC 서울</div>
					<div className="relative z-20 caption2-medium">53%</div>
				</div>
			</div>

			<div
				className={clsx('relative h-full flex flex-col justify-center items-center border-x border-black-300', {
					[selectedButtonClass('center')]: isParticipated && leftScore === rightScore,
				})}
			>
				<div
					className={clsx(
						'w-8 h-8 absolute z-20 -left-4 flex justify-center items-center rounded-lg body1-bold text-black-000',
						{
							'bg-primary-900': isParticipated && leftScore >= rightScore,
							'bg-black-500': !isParticipated || leftScore < rightScore,
						},
					)}
				>
					{leftScore}
				</div>
				<div
					className={clsx(
						'w-8 h-8 absolute z-20 -right-4 flex justify-center items-center rounded-lg body1-bold text-black-000',
						{
							'bg-primary-900': isParticipated && leftScore <= rightScore,
							'bg-black-500': !isParticipated || leftScore > rightScore,
						},
					)}
				>
					{rightScore}
				</div>
				<div className="relative z-20">무승부</div>
				<div className="relative z-20 caption2-medium">5%</div>
			</div>

			<div
				className={clsx('relative pr-4 h-full flex gap-2 justify-end items-center text-right rounded-r-[0.5625rem]', {
					[selectedButtonClass('right')]: isParticipated && leftScore < rightScore,
				})}
			>
				<div>
					<div className="relative z-20">FC 서울</div>
					<div className="relative z-20 caption2-medium">53%</div>
				</div>
				<Image className="relative z-20" width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
			</div>
		</div>
	);
}
