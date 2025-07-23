import clsx from 'clsx';

export default function MostHitTeam({
	teamName,
	teamLogo,
	teamColor,
}: {
	teamName: string;
	teamLogo: string;
	teamColor: string;
}) {
	const teamColorClassName = `border-[${teamColor}] before:bg-[${teamColor}] after:bg-[${teamColor}]`;
	const teamLogoClassName = teamLogo ? `bg-[url(${teamLogo})]` : 'bg-[url(/kick/red.svg)] ';

	return (
		<div
			className={clsx(
				`relative overflow-hidden h-15 body7-medium border rounded-lg bg-black-100
        before:content-[''] before:absolute before:top-1/2 before:-right-5
        before:h-[13px] before:w-20 before:rotate-311 
        after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2
        after:-right-3 after:h-[13px] after:w-30 after:rotate-311`,
				teamColorClassName,
			)}
		>
			<div
				className={`absolute z-10 top-1/2 left-4 -translate-y-1/2 w-27 h-auto aspect-square
          ${teamLogoClassName} bg-no-repeat bg-center bg-contain opacity-20`}
			/>
			<div className="absolute z-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-5/11 w-[60%] text-center">
				<span className="font-semibold break-keep">{teamName}</span>의 승부예측을 가장 많이 적중했어요.
			</div>
		</div>
	);
}
