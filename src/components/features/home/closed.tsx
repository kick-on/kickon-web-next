import Image from 'next/image';
import clsx from 'clsx';

export default function Closed({ isParticipated }: { isParticipated: boolean }) {
	const selectedButtonClass = 'bg-primary-200';
	const leftScore = 0 as number;
	const rightScore = 0 as number;

	return (
		<div className="relative w-[36rem] h-[4.625rem] grid grid-cols-3 bg-black-200 border border-black-300 rounded-[0.625rem] button3-semibold text-black-700">
			{isParticipated && (
				<div className="absolute pointer-events-none top-1/2 left-1/2 -translate-1/2 z-10 w-[36rem] h-[4.625rem] grid grid-cols-[1fr_11.9rem_1fr]">
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

			<div className="relative z-20 pl-4 h-full flex gap-2 items-center rounded-l-[0.5625rem]">
				<Image width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
				<div>
					<div>FC 서울</div>
					<div className="caption2-medium">53%</div>
				</div>
			</div>

			<div className="relative h-full flex flex-col justify-center items-center border-x border-black-300">
				<div>
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
				</div>
				<div className="relative z-20">무승부</div>
				<div className="relative z-20 caption2-medium">5%</div>
			</div>

			<div className="relative z-20 pr-4 h-full flex gap-2 justify-end items-center text-right rounded-r-[0.5625rem]">
				<div>
					<div>FC 서울</div>
					<div className="caption2-medium">53%</div>
				</div>
				<Image width={22} height={22} src="/team-logo/ulsan.svg" alt="FC 서울" />
			</div>
		</div>
	);
}
