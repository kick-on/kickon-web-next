import clsx from 'clsx';

export interface GameInfoBoxProps {
	isGambleInProgress: boolean;
	isGameInProgress: boolean;
	isGameCanceled: boolean;
	isGameCompleted: boolean;
	startDate: string;
	startTime: string;
}

export default function GameInfoBox({
	isGambleInProgress,
	isGameInProgress,
	isGameCanceled,
	isGameCompleted,
	startDate,
	startTime,
}: GameInfoBoxProps) {
	const gameStatusContent = (() => {
		if (isGambleInProgress) return '경기 전';
		if (isGameInProgress) return '경기 중';
		if (isGameCompleted) return '풀타임';
		if (isGameCanceled) return '경기 취소';
		return '기타';
	})();

	return (
		<div
			className={clsx('relative z-20 w-14 h-full flex flex-col justify-center items-center border rounded-lg mb-auto', {
				'border-black-200 bg-black-000': isGambleInProgress || isGameInProgress,
				'bg-black-200 border-black-100': !isGambleInProgress && !isGameInProgress,
			})}
		>
			<div className="body7-medium">{gameStatusContent}</div>
			<div className={clsx('button6-regular', { 'line-through': isGameCanceled })}>{startDate}</div>
			<div className={clsx('button6-regular', { 'line-through': isGameCanceled })}>{startTime}</div>
		</div>
	);
}
