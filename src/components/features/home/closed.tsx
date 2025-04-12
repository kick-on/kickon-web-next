import Image from 'next/image';
import clsx from 'clsx';
import { GameDto } from '@/services/apis/user-game-gamble/dto';

export default function Closed({
	homeTeam,
	awayTeam,
	homeScore,
	awayScore,
	gambleResult,
	isGameInProgress,
	isParticipated,
}: Pick<GameDto, 'homeTeam' | 'awayTeam' | 'homeScore' | 'awayScore' | 'gambleResult'> & {
	isGameInProgress: boolean;
	isParticipated: boolean;
}) {
	const leftScore = homeScore ?? '-';
	const rightScore = awayScore ?? '-';

	const selectedButtonClass = (side) =>
		`inset-0 before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0
		before:content-[''] before:bg-primary-200 before:shadow-closed-button-active
		${side === 'left' ? 'before:rounded-l-[0.5625rem]' : side === 'right' ? 'before:rounded-r-[0.5625rem]' : ''}`;

	return (
		<div
			className={clsx(
				'w-[36rem] h-[4.625rem] grid grid-cols-3 border rounded-[0.625rem] subtitle1-semibold',
				isGameInProgress
					? 'text-black-900 bg-black-000 border-black-200'
					: ' text-black-700 bg-black-200 border-black-300',
			)}
		>
			<div
				className={clsx('relative pl-4 h-full flex gap-2 items-center rounded-l-[0.5625rem]', {
					[selectedButtonClass('left')]: isParticipated && !isGameInProgress && leftScore > rightScore,
				})}
			>
				<Image
					className="relative z-20 w-[1.375rem] h-[1.375rem] object-contain"
					width={22}
					height={22}
					src={homeTeam.logoUrl}
					alt={`${homeTeam.name} 로고 이미지`}
				/>
				<div>
					<div className="relative z-20">{homeTeam.name || '팀 이름'}</div>
					<div className="relative z-20 caption2-medium">{`${gambleResult.home}%`}</div>
				</div>
			</div>

			<div
				className={clsx('relative h-full flex flex-col justify-center items-center border-x border-black-300', {
					[selectedButtonClass('center')]: isParticipated && !isGameInProgress && leftScore === rightScore,
				})}
			>
				<div
					className={clsx(
						'w-9 h-9 absolute z-20 -left-[1.125rem] flex justify-center items-center rounded-lg body1-bold text-black-000',
						isGameInProgress || !isParticipated || leftScore < rightScore ? 'bg-black-500' : 'bg-primary-900',
					)}
				>
					{leftScore}
				</div>
				<div
					className={clsx(
						'w-9 h-9 absolute z-20 -right-[1.125rem] flex justify-center items-center rounded-lg body1-bold text-black-000',
						isGameInProgress || !isParticipated || leftScore > rightScore ? 'bg-black-500' : 'bg-primary-900',
					)}
				>
					{rightScore}
				</div>
				<div className="relative z-20">무승부</div>
				<div className="relative z-20 caption2-medium">{gambleResult.draw}%</div>
			</div>

			<div
				className={clsx('relative pr-4 h-full flex gap-2 justify-end items-center text-right rounded-r-[0.5625rem]', {
					[selectedButtonClass('right')]: isParticipated && !isGameInProgress && leftScore < rightScore,
				})}
			>
				<div>
					<div className="relative z-20">{awayTeam.name || '팀 이름'}</div>
					<div className="relative z-20 caption2-medium">{`${gambleResult.away}%`}</div>
				</div>
				<Image
					className="relative z-20 w-[1.375rem] h-[1.375rem] object-contain"
					width={22}
					height={22}
					src={awayTeam.logoUrl}
					alt={`${awayTeam.name} 로고 이미지`}
				/>
			</div>
		</div>
	);
}
