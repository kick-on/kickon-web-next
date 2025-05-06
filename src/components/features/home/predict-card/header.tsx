import { MyGambleResultDto } from '@/services/apis/user-game-gamble/dto';
import clsx from 'clsx';

export interface HeaderProps {
	leagueName: string;
	isGambleInProgress: boolean;
	isGameInProgress: boolean;
	isGameCanceled: boolean;
	myGambleResult: MyGambleResultDto;
	startDate: string;
	startTime: string;
	timeBefore: string;
}

export default function Header({
	leagueName,
	isGambleInProgress,
	isGameInProgress,
	isGameCanceled,
	myGambleResult,
	startDate,
	startTime,
	timeBefore,
}: HeaderProps) {
	const gambleStatusContent = (() => {
		if (isGambleInProgress) return '예측 진행 중';
		if (isGameInProgress && myGambleResult) return '참여 완료';
		if (!myGambleResult) return '미참여';
		if (myGambleResult.gambleStatus === 'SUCCEED') return '예측 성공';
		if (myGambleResult.gambleStatus === 'FAILED') return '예측 실패';
		return '-';
	})();

	return (
		<div className="flex justify-between items-center mb-[0.9375rem]">
			<div className="subtitle1-semibold flex items-center">
				{leagueName || '리그'}
				<div
					className={clsx(
						'px-2 py-1 ml-2 mr-0.5 rounded-full text-black-000 caption2-regular text-center items-center',
						{
							'bg-black-900': isGambleInProgress || (isGameInProgress && myGambleResult),
							'bg-primary-900':
								myGambleResult &&
								(myGambleResult.gambleStatus === 'SUCCEED' || myGambleResult.gambleStatus === 'PERFECT'),
							'bg-black-700': myGambleResult && myGambleResult.gambleStatus === 'FAILED',
							'bg-black-500': !myGambleResult || isGameCanceled,
						},
					)}
				>
					{gambleStatusContent}
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
	);
}
