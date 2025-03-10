'use client';

import { allCommunities } from '@/components/common/category-tab/category-tab';
import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import { useSearchParams } from 'next/navigation';

export default function Page() {
	const searchParams = useSearchParams();
	const boardId = searchParams.get('id');

	if (!boardId) return <p>잘못된 접근입니다.</p>;

	return (
		<>
			<ComponentFrame isMain={true}>게시글 상세페이지</ComponentFrame>
			<RecommendedContent type="board" data={allCommunities} />
		</>
	);
}
