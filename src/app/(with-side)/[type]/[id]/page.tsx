import { notFound } from 'next/navigation';

import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import DetailContent from '@/components/features/detail/content/DetailContent';
import CommentSection from '@/components/features/detail/comment/CommentSection';
import { getDetailContent } from '@/services/apis/detail';
import FetchingFailedCard from '@/components/common/fetching-failed-card';

import { GetDetailResponse } from '@/services/apis/detail/dto';
import { getCommentList } from '@/services/apis/detail/comment';
import { GetCommentsResponse } from '@/services/apis/detail/comment/dto';
import PrivacyAgreementButton from '@/components/features/button';

//import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

// TODO: 내 정보 불러와서 내 팀 뉴스인지 isOurTeamPost 확인하기
const DetailPage = async ({ params }: { params?: { type?: string; id?: string } }) => {
	if (!params?.type || !params?.id) return notFound();

	const { type, id } = params;
	const contents = (await getDetailContent(type as 'news' | 'board', Number(id))) as GetDetailResponse;
	console.log(contents.data);

	const comments = (await getCommentList(Number(id), 1, 10, type === 'news')) as GetCommentsResponse;
	console.log(comments);

	return (
		<div className="flex flex-col gap-4">
			<ComponentFrame isMain={true}>
				{contents.data ? (
					<>
						<DetailContent data={contents.data} type={type} />
						<PrivacyAgreementButton />
					</>
				) : (
					<FetchingFailedCard height="800px" marginTop="200px" onClick={() => {}} />
				)}
				{comments ? (
					<CommentSection type={type} comments={comments.data} contentsId={contents.data.pk} />
				) : (
					<FetchingFailedCard height="300px" marginTop="50px" onClick={() => {}} />
				)}
			</ComponentFrame>

			<RecommendedContent mode="뉴스" teamName="FC 서울" />
		</div>
	);
};

export default DetailPage;
//Todo 저 비어있는  onClick={()=>{}} 이거 채워
