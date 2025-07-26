export default function MostHitTeam({
	teamName,
	teamLogo,
	teamColor,
}: {
	teamName: string;
	teamLogo: string;
	teamColor: string;
}) {
	return (
		<div
			className="relative overflow-hidden h-15 body7-medium bg-black-100
				border rounded-lg border-[var(--team-color)]
        before:content-[''] before:absolute before:top-1/2 before:-right-5
        before:h-[13px] before:w-20 before:rotate-311 before:bg-[var(--team-color)]
        after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2
        after:-right-3 after:h-[13px] after:w-30 after:rotate-311 after:bg-[var(--team-color)]"
			style={{ '--team-color': teamColor } as React.CSSProperties}
		>
			<div
				className="absolute z-10 top-1/2 left-4 -translate-y-1/2
          bg-no-repeat bg-center bg-contain opacity-20 w-27 h-auto aspect-square"
				style={{ backgroundImage: `url(${teamLogo || '/kick/red.svg'})` }}
			/>
			<div className="absolute z-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-5/11 w-[60%] text-center">
				<span className="font-semibold break-keep">{teamName}</span>의 승부예측을 가장 많이 적중했어요.
			</div>
		</div>
	);
}
