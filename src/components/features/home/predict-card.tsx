import clsx from 'clsx';
import InProgress from './in-progress';
import Closed from './closed';
import { GameDto } from '@/services/apis/user-game-gamble/dto';
import { formatGameStartDate } from '@/lib/utils/formatGameStartDate';
import { formatGambleParticipations } from '@/lib/utils/formatGambleParicipations';
import { getGameStartTimeBefore } from '@/lib/utils/getGameStartTimeBefore';

export default function PredictCard({
	pk,
	homeTeam,
	awayTeam,
	gambleResult,
	myGambleResult,
	homeScore,
	awayScore,
	gameStatus,
	startAt,
	leagueName,
}: GameDto & { leagueName: string }) {
	const [startDate, startTime] = formatGameStartDate(startAt);
	const participations = formatGambleParticipations(gambleResult.participationNumber);
	const timeBefore = getGameStartTimeBefore(startAt);

	const successBackground =
		'linear-gradient(262deg, #000 -20.49%, #600606 3.69%, #C00C0B 50.27%, #600606 87.98%, #000 114.36%)';
	const failBackground =
		'linear-gradient(84deg, #6D6D6D -12.16%, #888 11.83%, #AFAFAF 49.66%, #888 95.51%, #6D6D6D 113.24%)';

	return (
		<div
			className={clsx(
				'w-[41.75rem] min-h-[11rem] bg-black-000 rounded-[0.625rem] flex flex-col px-4 py-[1.375rem] gap-[0.625rem] transition-all',
				{ 'text-black-700': gameStatus !== 'PENDING' },
			)}
		>
			<div className="flex justify-between items-center">
				<div className="subtitle1-semibold flex gap-2 items-center">
					{leagueName || '리그'}
					<div
						className={clsx('px-2 py-1 rounded-full text-black-000 caption2-regular text-center items-center', {
							'bg-black-900': gameStatus === 'PENDING',
							'bg-black-500': gameStatus !== 'PENDING',
						})}
						style={{
							background:
								myGambleResult?.gambleStatus === 'SUCCEED'
									? successBackground
									: myGambleResult?.gambleStatus === 'FAILED'
										? failBackground
										: '',
						}}
					>
						{gameStatus === 'PENDING'
							? '예측 진행 중'
							: !myGambleResult
								? '미참여'
								: myGambleResult.gambleStatus === 'SUCCEED'
									? '예측 성공'
									: myGambleResult.gambleStatus === 'FAILED'
										? `예측 실패 ${myGambleResult.homeScore}:${myGambleResult.awayScore}`
										: ''}
					</div>
				</div>
				{gameStatus === 'PENDING' && <div className="caption1-regular text-black-700">마감 {timeBefore}</div>}
			</div>
			<div className="flex gap-1.5 items-center">
				<div
					className={clsx(
						'px-[0.3125rem] py-3 flex flex-col justify-center items-center border border-black-200 rounded-[0.625rem]',
						{ 'bg-black-200': gameStatus !== 'PENDING' },
					)}
				>
					<div className="body7-medium">
						{gameStatus === 'PENDING' ? '경기 전' : gameStatus === 'AWAY' || 'HOME' || 'DRAW' ? '풀타임' : '기타'}
					</div>
					<div className="button6-regular">{startDate}</div>
					<div className="button6-regular">{startTime}</div>
				</div>
				{gameStatus === 'PENDING' ? (
					<InProgress
						pk={pk}
						homeTeam={homeTeam}
						awayTeam={awayTeam}
						gambleResult={gambleResult}
						myGambleResult={myGambleResult}
					/>
				) : (
					<Closed
						homeTeam={homeTeam}
						awayTeam={awayTeam}
						homeScore={homeScore}
						awayScore={awayScore}
						gambleResult={gambleResult}
						isParticipated={!!myGambleResult}
					/>
				)}
			</div>
			<div className="caption1-regular text-black-700 text-right">{participations}명 참여</div>
		</div>
	);
}
