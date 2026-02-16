'use client';

import { useMatchAiAnalyticsQuery } from '@/lib/hooks/queries/useMatchAiQuery';

export default function AiAnalytics({ pk }: { pk: number }) {
	const { data: response, isError, isLoading } = useMatchAiAnalyticsQuery(pk);
	const analytics = response?.data;

	if (isLoading) {
		return (
			<div className="bg-black-200 text-black rounded px-4 pt-3 pb-4 mx-4">
				<h3 className="text-subtitle-02 font-semibold">킥온 AI 분석</h3>
				<span className="text-subtitle-02">데이터를 불러오는 중입니다...</span>
			</div>
		);
	}

	if (isError || !analytics) {
		return (
			<div className="bg-black-200 text-black rounded px-4 pt-3 pb-4 mx-4">
				<h3 className="text-subtitle-02 font-semibold">킥온 AI 분석</h3>
				<span className="text-subtitle-02">데이터를 불러오는 데 실패했습니다.</span>
			</div>
		);
	}

	return (
		<div className="bg-black-200 text-black rounded px-4 pt-3 pb-4 mx-4 space-y-3">
			<div className="space-y-1">
				<h3 className="text-subtitle-02 font-semibold">킥온 AI 분석</h3>
				<ul className="pl-4 text-caption-01 list-disc break-words">
					<li>{analytics.summary}</li>
				</ul>
			</div>
			<div className="space-y-1">
				<h3 className="text-subtitle-02 font-semibold">MVP {analytics.mvp.playerName}</h3>
				<ul className="pl-4 text-caption-01 list-disc break-words">
					<li>{analytics.mvp.oneLineReview}</li>
				</ul>
			</div>
			<div className="space-y-1">
				<h3 className="text-subtitle-02 font-semibold">WORST {analytics.worst.playerName}</h3>
				<ul className="pl-4 text-caption-01 list-disc break-words">
					<li>{analytics.worst.oneLineReview}</li>
				</ul>
			</div>
		</div>
	);
}
