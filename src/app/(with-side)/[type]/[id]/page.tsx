import { notFound } from 'next/navigation';

import { mockNewsList } from '@/lib/mock';
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

const config = {
	news: { allowComments: true, imagePosition: 'top' },
	board: { allowComments: true, imagePosition: 'bottom' },
};

// TODO: 내 팀 뉴스인지 확인, 뉴스에 있는 team pk와 내 팀 pk랑 비교
const DetailPage = async ({ params }: { params?: { type?: string; id?: string } }) => {
	if (!params?.type || !params?.id) return notFound();

	const { type, id } = params;

	if (!config[type]) return notFound(); // 유효한 type인지 확인

	const contents = (await getDetailContent(type as 'news' | 'board', Number(id))) as GetDetailResponse;
	console.log(contents.data); // TODO: 추후에는 이 상세 페이지 정보가 안 불러와지면 댓글까지 렌더링 안 되도록 if(!data) return(<FetchingFailedCard/>)

	const comments = (await getCommentList(Number(id), 1, 10, type === 'news')) as GetCommentsResponse;
	console.log(comments);

	const { allowComments, imagePosition } = config[type];

	// const { currentUserInfo } = useCurrentUserInfoStore.getState();
	// const isOurTeamPost = contents.data.team?.pk === currentUserInfo?.teamPk;
	const isOurTeamPost = true;

	return (
		<div className="flex flex-col gap-4">
			<ComponentFrame isMain={true}>
				{contents.data ? (
					<>
						<DetailContent
							data={contents.data}
							imagePosition={imagePosition}
							type={type}
							isOurTeamPost={isOurTeamPost}
						/>
						<PrivacyAgreementButton />
					</>
				) : (
					<FetchingFailedCard height="800px" marginTop="200px" onClick={() => {}} />
				)}
				{comments ? (
					<CommentSection
						type={type}
						allowComments={allowComments}
						isOurTeamPost={isOurTeamPost}
						comments={comments.data}
						contentsId={contents.data.pk}
					/>
				) : (
					<FetchingFailedCard height="300px" marginTop="50px" onClick={() => {}} />
				)}
			</ComponentFrame>

			<RecommendedContent mode="뉴스" data={mockNewsList} teamName="FC 서울" />
		</div>
	);
};

export default DetailPage;
//Todo 저 비어있는  onClick={()=>{}} 이거 채워
