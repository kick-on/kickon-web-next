import clsx from 'clsx';
import InProgress from '../in-progress';
import Closed from '../closed';
import { GameDto } from '@/services/apis/user-game-gamble/dto';
import { formatGameStartDate } from '@/lib/utils/formatGameStartDate';
import { formatGambleParticipations } from '@/lib/utils/formatGambleParicipations';
import { getGameStartTimeBefore } from '@/lib/utils/getGameStartTimeBefore';
import ButtonTypeInProgress from '../button-type-in-progress';
import GameInfoBox, { GameInfoBoxProps } from './game-info-box';
import TeamButton from './team-button';
import ScoreButton from './score-button';
import ConfirmButton from './confirm-button';
import Header, { HeaderProps } from './header';

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

	const headerProps: HeaderProps = {
		leagueName,
		isGambleInProgress,
		isGameInProgress,
		isGameCanceled,
		startDate,
		startTime,
		timeBefore,
		myGambleResult,
	};

	const gameInfoBoxProps: GameInfoBoxProps = {
		isGambleInProgress,
		isGameInProgress,
		isGameCanceled,
		isGameCompleted,
		startDate,
		startTime,
	};

	return (
		<div
			className="flex flex-col justify-center px-4 min-h-[10.625rem]
				bg-black-000 rounded-lg transition-all overflow-hidden"
		>
			<Header {...headerProps} />
			<div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-1.5">
				<GameInfoBox {...gameInfoBoxProps} />
				<TeamButton />
				<div></div>
				<div>
					<ScoreButton />
					<ConfirmButton />
				</div>
			</div>
			<footer className="mt-2 caption1-regular text-black-700 text-right">{participations}명 참여</footer>
		</div>
	);
}
