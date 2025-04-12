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
	refetchGames,
}: GameDto & { leagueName: string; refetchGames?: () => void }) {
	const [startDate, startTime] = formatGameStartDate(startAt);
	const participations = formatGambleParticipations(gambleResult.participationNumber);
	const timeBefore = getGameStartTimeBefore(startAt);

	const isGameCompleted = gameStatus === 'HOME' || gameStatus === 'DRAW' || gameStatus === 'AWAY';

	return (
		<div
			className={clsx(
				'w-[41.75rem] min-h-[11rem] bg-black-000 rounded-[0.625rem] flex flex-col px-4 py-[1.375rem] gap-[0.625rem] transition-all',
				{ 'text-black-700': gameStatus !== 'PENDING' },
			)}
		>
			<div className="flex justify-between items-center">
				<div className="subtitle1-semibold flex items-center">
					{leagueName || '리그'}
					<div
						className={clsx(
							'px-2 py-1 ml-2 mr-0.5 rounded-full text-black-000 caption2-regular text-center items-center',
							{
								'bg-black-900': gameStatus === 'PENDING',
								'bg-primary-900':
									myGambleResult &&
									(myGambleResult.gambleStatus === 'SUCCEED' || myGambleResult.gambleStatus === 'PERFECT'),
								'bg-black-700': myGambleResult && myGambleResult.gambleStatus === 'FAILED',
								'bg-black-500': !myGambleResult || gameStatus === 'CANCELED',
							},
						)}
					>
						{gameStatus === 'PENDING'
							? '예측 진행 중'
							: !myGambleResult
								? '미참여'
								: myGambleResult.gambleStatus === 'SUCCEED'
									? '예측 성공'
									: myGambleResult.gambleStatus === 'FAILED'
										? `예측 실패`
										: ''}
					</div>
					{isGameCompleted && myGambleResult && (
						<div className="caption2-regular text-black-700">
							・내 예측 {myGambleResult.homeScore}:{myGambleResult.awayScore}
						</div>
					)}
				</div>
				{gameStatus === 'PENDING' && <div className="caption1-regular text-black-700">마감 {timeBefore}</div>}
			</div>
			<div className="flex gap-1.5 items-start">
				<div
					className={clsx('w-[3.5rem] py-3 flex flex-col justify-center items-center border rounded-[0.625rem]', {
						'border-black-200': gameStatus === 'PENDING',
						'bg-black-200 border-black-100': gameStatus !== 'PENDING',
					})}
				>
					<div className="body7-medium">
						{gameStatus === 'PENDING'
							? '경기 전'
							: gameStatus === 'AWAY' || gameStatus === 'HOME' || gameStatus === 'DRAW'
								? '풀타임'
								: gameStatus === 'CANCELED' || gameStatus === 'POSTPONED'
									? '경기 취소'
									: '기타'}
					</div>
					<div className={clsx('button6-regular', { 'line-through': gameStatus === 'CANCELED' })}>{startDate}</div>
					<div className={clsx('button6-regular', { 'line-through': gameStatus === 'CANCELED' })}>{startTime}</div>
				</div>
				{gameStatus === 'PENDING' ? (
					<InProgress
						pk={pk}
						homeTeam={homeTeam}
						awayTeam={awayTeam}
						gambleResult={gambleResult}
						myGambleResult={myGambleResult}
						refetchGames={refetchGames}
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
