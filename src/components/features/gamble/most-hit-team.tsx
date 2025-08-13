import clsx from 'clsx';

export default function MostHitTeam({
	totalParticipationCount,
	teamName,
	teamLogo,
	teamColor,
}: {
	totalParticipationCount: number;
	teamName: string;
	teamLogo: string;
	teamColor: string;
}) {
	// 승부 예측 참여, 적중 팀까지 있는 경우
	const isActive = Boolean(totalParticipationCount && teamName);

	return (
		<div
			className={clsx(
				`relative overflow-hidden h-15 body7-medium bg-black-100
				border rounded-lg border-[var(--team-color)]
        before:content-[''] before:absolute before:top-1/2 before:-right-5
        before:h-[13px] before:w-20 before:rotate-311 before:bg-[var(--team-color)]
        after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2
        after:-right-3 after:h-[13px] after:w-30 after:rotate-311 after:bg-[var(--team-color)]`,
				{ 'before:hidden after:hidden': !isActive },
			)}
			style={{ '--team-color': isActive ? teamColor : 'var(--color-black-200)' } as React.CSSProperties}
		>
			{isActive && (
				<div
					className="absolute z-10 top-1/2 left-4 -translate-y-1/2
          bg-no-repeat bg-center bg-contain opacity-20 w-27 h-auto aspect-square"
					style={{ backgroundImage: `url(${teamLogo || '/kick/red.svg'})` }}
				/>
			)}
			<div
				className={clsx(
					'absolute z-10 top-1/2 left-1/2 -translate-y-1/2 text-center',
					isActive ? '-translate-x-5/11 w-[60%]' : '-translate-x-1/2 w-full',
				)}
			>
				{!totalParticipationCount ? (
					'승부예측에 참여한 이력이 없어요.'
				) : !teamName ? (
					'아직 예측에 적중한 팀이 없어요.'
				) : (
					<>
						<span className="font-semibold break-keep">{teamName}</span>의 승부예측을 가장 많이 적중했어요.
					</>
				)}
			</div>
		</div>
	);
}
