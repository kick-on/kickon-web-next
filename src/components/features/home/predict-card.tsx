import clsx from 'clsx';
import InProgress from './in-progress';
import Closed from './closed';

export default function PredictCard() {
	const isInProgress = false;
	return (
		<div
			className={clsx(
				'w-[41.75rem] min-h-[11rem] bg-black-000 rounded-[0.625rem] flex flex-col px-4 py-[1.375rem] gap-[0.625rem] transition-all',
			)}
		>
			<div className="flex justify-between items-center">
				<div className="subtitle1-semibold flex gap-2 items-center">
					K리그 1
					<div
						className={clsx('px-2 py-1 rounded-full text-black-000 caption2-regular text-center items-center', {
							'bg-black-900': isInProgress,
							'bg-black-500': !isInProgress,
						})}
					>
						{isInProgress ? '예측 진행 중' : '미참여'}
					</div>
				</div>
				{isInProgress && <div className="caption1-regular text-black-700">마감 50분 전</div>}
			</div>
			<div className="flex gap-1.5 items-center">
				<div
					className={clsx(
						'px-[0.3125rem] py-3 flex flex-col justify-center items-center border border-black-200 rounded-[0.625rem]',
						{ 'bg-black-200': !isInProgress },
					)}
				>
					<div className="body7-medium">경기 전</div>
					<div className="button6-regular">01.25 (토)</div>
					<div className="button6-regular">04:30</div>
				</div>
				{isInProgress ? <InProgress /> : <Closed />}
			</div>
			<div className="caption1-regular text-black-700 text-right">1,204명 참여</div>
		</div>
	);
}
