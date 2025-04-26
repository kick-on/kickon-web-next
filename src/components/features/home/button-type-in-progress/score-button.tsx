export default function ScoreButton() {
	const activeButtonClass = (score) =>
		`inset-0 before:absolute before:z-20 before:top-0 before:left-0 before:bottom-0 before:right-0
    before:content-[''] active:before:bg-primary-50 active:before:shadow-score-button-active before:transition-all
    ${score === 1 && 'before:rounded-l-md'} ${score === 20 && 'before:rounded-r-md'}`;

	return (
		<div
			className="absolute z-10 bottom-[3.375rem] -left-4
        w-[calc(100vw-16px)] pb-2.5 pl-4 pr-8 overflow-scroll no-scrollbar"
		>
			<div
				className="relative overflow-hidden z-10 flex w-fit 
        bg-black-000 border border-black-200 rounded-md shadow-predict-button"
			>
				{new Array(20).fill(null).map((_, i) => (
					<div key={i} className="flex items-center">
						<button className={`relative p-4 ${activeButtonClass(i + 1)}`}>
							<div className="w-3 h-4 body4-medium flex items-center justify-center">{i + 1}</div>
						</button>
						{i + 1 !== 20 && <div className="h-9 border-r border-black-200"></div>}
					</div>
				))}
			</div>
		</div>
	);
}
