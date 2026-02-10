export default function AiAnalytics({ pk }: { pk: number }) {
	// pk 기반으로 ai 분석 조회
	const summary =
		'어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구';
	const mvp = {
		name: '손흥민',
		oneLineReview:
			'어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구',
	};
	const worst = {
		name: '손흥민',
		oneLineReview:
			'어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구',
	};

	return (
		<div className="bg-black-200 text-black rounded px-4 pt-3 pb-4 mx-4 space-y-3">
			<div className="space-y-1">
				<h3 className="text-subtitle-02 font-semibold">킥온 AI 분석</h3>
				<ul className="pl-4 text-caption-01 list-disc">
					<li>{summary}</li>
				</ul>
			</div>
			<div className="space-y-1">
				<h3 className="text-subtitle-02 font-semibold">MVP {mvp.name}</h3>
				<ul className="pl-4 text-caption-01 list-disc">
					<li>{mvp.oneLineReview}</li>
				</ul>
			</div>
			<div className="space-y-1">
				<h3 className="text-subtitle-02 font-semibold">WORST {worst.name}</h3>
				<ul className="pl-4 text-caption-01 list-disc">
					<li>{worst.oneLineReview}</li>
				</ul>
			</div>
		</div>
	);
}
