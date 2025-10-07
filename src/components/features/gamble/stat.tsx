'use client';

import useIsMobile from '@/lib/hooks/useIsMobile';
import { roundToOneDecimal } from '@/lib/utils';
import { getMyStats } from '@/services/apis/game/game.api';
import { MyStatsDto } from '@/services/apis/game/game.type';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Chart from './chart';
import MostHitTeam from './most-hit-team';

export default function Stat() {
	const isMobile = useIsMobile();
	const [statData, setStatData] = useState<MyStatsDto | null>(null);

	const miniBoxes = [
		{
			label: '참여한 예측',
			value: statData?.totalParticipationCount,
			unit: '개',
			caption: `참여율 ${roundToOneDecimal(statData?.totalParticipationRate * 100)}%`,
		},
		{
			label: '이번달 성공률',
			value: roundToOneDecimal(statData?.thisMonthSuccessRate * 100),
			unit: '%',
			caption: `(${statData?.thisMonthHitSummary}개)`,
		},
		{
			label: '이번달 누적 포인트',
			value: statData?.thisMonthPoints,
			unit: 'P',
			caption: `총 ${statData?.totalPoints}P`,
		},
	];

	useEffect(() => {
		const apiCall = async () => {
			try {
				const response = await getMyStats();
				setStatData(response.data);
			} catch (error) {
				alert(error.message);
			}
		};

		apiCall();
	}, []);

	if (!statData) return null;

	return (
		<div>
			<div
				className="grid grid-cols-[1fr_auto] gap-2.5 rounded-[0.625rem] border border-black-200 p-4
					@mobile:border-0 @mobile:p-0"
			>
				<div className="pr-2.5 h-full grid grid-rows-[auto_1fr]">
					<div>
						<div className="body4-medium mb-1">나의 예측 성공률</div>
						<div className="body7-regular text-black-500 mb-4">지금까지 누적된 예측 성공률 기준</div>
					</div>

					<div className="relative w-31 @mobile:w-34 aspect-square m-auto">
						<Chart totalSuccessRate={statData.totalSuccessRate} />
						<div className="absolute top-1/2 left-1/2 -translate-1/2 w-full h-full flex justify-center items-center body2-semibold @mobile:text-18 text-primary-900">
							{roundToOneDecimal(statData.totalSuccessRate * 100)}%
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2.5">
					<div className={clsx('grid', isMobile ? 'grid-rows-3 gap-1' : 'grid-cols-3 gap-2.5')}>
						{miniBoxes.map((box) => (
							<div key={box.label} className="w-[7.625rem] p-3 pb-2.5 bg-black-100 border border-black-200 rounded-lg">
								<div className="body7-medium text-black-500 mb-1">{box.label}</div>
								<div className="display-semibold text-primary-900 text-right @mobile:text-24">
									{box.value}
									<span className="body5-medium text-black-900 ml-0.5">{box.unit}</span>
								</div>
								<div className="body7-regular text-black-700 text-right">{box.caption}</div>
							</div>
						))}
					</div>

					{!isMobile && (
						<MostHitTeam
							totalParticipationCount={statData.totalParticipationCount}
							teamName={statData.mostHitTeamName}
							teamLogo={statData.mostHitTeamLogoUrl}
							teamColor={statData.mostHitTeamColor ?? 'var(--color-primary-900)'}
						/>
					)}
				</div>
			</div>

			{isMobile && (
				<div className="mt-6">
					<MostHitTeam
						totalParticipationCount={statData.totalParticipationCount}
						teamName={statData.mostHitTeamName}
						teamLogo={statData.mostHitTeamLogoUrl}
						teamColor={statData.mostHitTeamColor ?? 'var(--color-primary-900)'}
					/>
				</div>
			)}
		</div>
	);
}
