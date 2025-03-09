'use client';
import { allCommunities } from '@/components/common/category-tab/category-tab';
import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import { useSearchParams } from 'next/navigation';

export default function Page() {
	const searchParams = useSearchParams();
	const newsId = searchParams.get('id');

	if (!newsId) return <p>잘못된 접근입니다.</p>; // 임시

	// 이것도 마찬가지로 불필요한 api 호출을 줄이기 위해 캐시된 걸 사용?

	return (
		<>
			<ComponentFrame isMain={true}>게시글 상세페이지</ComponentFrame>
			<RecommendedContent type="board" data={allCommunities} />
		</>
	);
}
