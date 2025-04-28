import clsx from 'clsx';
import InProgress from './in-progress';
import Closed from './closed';
import { GameDto } from '@/services/apis/user-game-gamble/dto';
import { formatGameStartDate } from '@/lib/utils/formatGameStartDate';
import { formatGambleParticipations } from '@/lib/utils/formatGambleParicipations';
import { getGameStartTimeBefore } from '@/lib/utils/getGameStartTimeBefore';
import ButtonTypeInProgress from './button-type-in-progress';

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
	type,
	leagueName,
	refetchGames,
}: GameDto & { type: 'proceeding' | 'finished'; leagueName: string; refetchGames?: () => void }) {
	const [startDate, startTime] = formatGameStartDate(startAt);
	const participations = formatGambleParticipations(gambleResult.participationNumber);
	const timeBefore = getGameStartTimeBefore(startAt);

	const isGambleInProgress = type === 'proceeding'; // 예측 진행 중
	const isGameInProgress = type === 'finished' && (gameStatus === 'PENDING' || gameStatus === 'PROCEEDING'); // 경기 중
	const isGameCanceled = gameStatus === 'CANCELED' || gameStatus === 'POSTPONED';
	const isGameCompleted = gameStatus === 'HOME' || gameStatus === 'DRAW' || gameStatus === 'AWAY';
	const gameStatusContent = (() => {
		if (isGambleInProgress) return '경기 전';
		if (isGameInProgress) return '경기 중';
		if (isGameCompleted) return '풀타임';
		if (isGameCanceled) return '경기 취소';
		return '기타';
	})();

	const isMobile = true;
	const isTablet = true;

	const buttonTypeInProgressProps = {
		startDate,
		startTime,
		isGambleInProgress,
		isGameInProgress,
		isGameCanceled,
		gameStatusContent,
	};

	return (
		<div
			// TODO: KO-271 병합 후 @mobile:mx-4 제거
			className={clsx(
				`@mobile:grow @mobile:w-auto @mobile:rounded-lg @mobile:py-4 @mobile:mx-4
				w-[41.75rem] min-h-[11rem] bg-black-000 rounded-[0.625rem]
				flex flex-col px-4 py-[1.375rem] gap-2.5 transition-all overflow-hidden`,
				{ 'text-black-700': !isGambleInProgress && !isGameInProgress },
			)}
		>
			<div className="flex justify-between items-center">
				<div className="subtitle1-semibold flex items-center">
					{leagueName || '리그'}
					<div
						className={clsx(
							'px-2 py-1 ml-2 mr-0.5 rounded-full text-black-000 caption2-regular text-center items-center',
							{
								'bg-black-900': isGambleInProgress || isGameInProgress,
								'bg-primary-900':
									myGambleResult &&
									(myGambleResult.gambleStatus === 'SUCCEED' || myGambleResult.gambleStatus === 'PERFECT'),
								'bg-black-700': myGambleResult && myGambleResult.gambleStatus === 'FAILED',
								'bg-black-500': !myGambleResult || isGameCanceled,
							},
						)}
					>
						{isGambleInProgress
							? '예측 진행 중'
							: isGameInProgress && myGambleResult
								? '참여 완료'
								: !myGambleResult
									? '미참여'
									: myGambleResult.gambleStatus === 'SUCCEED'
										? '예측 성공'
										: myGambleResult.gambleStatus === 'FAILED'
											? `예측 실패`
											: ''}
					</div>
					{!isGambleInProgress && myGambleResult && (
						<div className="caption2-regular text-black-700">
							・내 예측 {myGambleResult.homeScore}:{myGambleResult.awayScore}
						</div>
					)}
				</div>
				<div className="@mobile:block hidden caption1-regular text-black-600">
					{startDate.split(' ')} {startTime}
				</div>
				{isGambleInProgress && <div className="@mobile:hidden caption1-regular text-black-700">마감 {timeBefore}</div>}
			</div>

			<div className="flex gap-1.5 items-start">
				{!(isMobile || isTablet) && (
					<div
						className={clsx(
							'-ml-1 w-[3.375rem] py-3 flex flex-col justify-center items-center border rounded-[0.625rem]',
							{
								'border-black-200 bg-black-000': isGambleInProgress || isGameInProgress,
								'bg-black-200 border-black-100': !isGambleInProgress && !isGameInProgress,
							},
						)}
					>
						<div className="body7-medium">{gameStatusContent}</div>
						<div className={clsx('button6-regular', { 'line-through': isGameCanceled })}>{startDate}</div>
						<div className={clsx('button6-regular', { 'line-through': isGameCanceled })}>{startTime}</div>
					</div>
				)}

				{isGambleInProgress ? (
					isMobile ? (
						<ButtonTypeInProgress
							pk={pk}
							homeTeam={homeTeam}
							awayTeam={awayTeam}
							gambleResult={gambleResult}
							myGambleResult={myGambleResult}
							{...buttonTypeInProgressProps}
							refetchGames={refetchGames}
						/>
					) : (
						<InProgress
							pk={pk}
							homeTeam={homeTeam}
							awayTeam={awayTeam}
							gambleResult={gambleResult}
							myGambleResult={myGambleResult}
							refetchGames={refetchGames}
						/>
					)
				) : // <Closed
				// 	homeTeam={homeTeam}
				// 	awayTeam={awayTeam}
				// 	homeScore={homeScore}
				// 	awayScore={awayScore}
				// 	gambleResult={gambleResult}
				// 	isGameInProgress={isGameInProgress}
				// 	isParticipated={!!myGambleResult}
				// />
				null}
			</div>
			<div className="caption1-regular text-black-700 text-right">{participations}명 참여</div>
		</div>
	);
}
