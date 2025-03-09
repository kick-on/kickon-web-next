'use client';
import { allNews } from '@/components/common/category-tab/category-tab';
import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import { useSearchParams } from 'next/navigation';

export default function Page() {
	const searchParams = useSearchParams();
	const newsId = searchParams.get('id');
	//const teamName = searchParams.get('team');

	const myTeamName = 'FC 서울'; // 임시

	if (!newsId) return <p>잘못된 접근입니다.</p>; // 임시

	// 만약 게시글 상세 조회될 때 나의 팀 뉴스인지 아닌지 뜬다 -> RelatedContent에 전달.
	// 혹은 현재 url이 /news?q=FC서울 이런 식으로 뜨는데, 뉴스 아이템을 클릭하면
	// 뉴스 리스트에서 클릭해서 뉴스 상세 페이지로 들어오는 경로일 텐데, 이때 상세페이지 아래에도 뉴스 리스트가 필요함. /news?q=FC서울/detail&id=1 이런 식으로 접근 되려나?
	// 그럼 쿼리 파싱해서 사용.
	// 뉴스 리스트 페이지에서 캐싱한 걸 가져다 쓸 수 있을까

	return (
		<>
			<ComponentFrame isMain={true}>뉴스 상세페이지</ComponentFrame>
			<RecommendedContent type="news" data={allNews} isMyTeam={true} teamName={myTeamName} />
		</>
	);
}
