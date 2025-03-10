'use client';

import { allNews } from '@/components/common/category-tab/category-tab';
import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import { useSearchParams } from 'next/navigation';

export default function Page() {
	const searchParams = useSearchParams();
	const newsId = searchParams.get('id');

	const myTeamName = 'FC 서울';

	if (!newsId) return <p>잘못된 접근입니다.</p>; // 임시
	return (
		<>
			<ComponentFrame isMain={true}>뉴스 상세페이지</ComponentFrame>
			<RecommendedContent type="news" data={allNews} teamName={myTeamName} />
		</>
	);
}
