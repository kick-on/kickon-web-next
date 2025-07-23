export default function Chart({ totalSuccessRate }: { totalSuccessRate: number }) {
	const R = 52;
	const CIRCUMFERENCE = 2 * Math.PI * R;
	const strokeWidth = 18;

	return (
		<svg viewBox="0 0 124 124">
			<circle cx="62" cy="62" r={R} fill="none" stroke="var(--color-black-200)" strokeWidth={strokeWidth} />
			<circle
				cx="62"
				cy="62"
				r={R}
				fill="none"
				stroke="var(--color-primary-900)"
				strokeWidth={strokeWidth}
				stroke-linecap="round"
				strokeDasharray={`${CIRCUMFERENCE * totalSuccessRate} ${CIRCUMFERENCE * (1 - totalSuccessRate)}`}
				strokeDashoffset={CIRCUMFERENCE * 0.23}
			/>
		</svg>
	);
}
