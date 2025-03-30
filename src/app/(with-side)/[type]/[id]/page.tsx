import { notFound } from 'next/navigation';
import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import DetailContent from '@/components/features/detail/content/DetailContent';
import CommentSection from '@/components/features/detail/comment/CommentSection';
import { allNews } from '@/components/common/category-tab/category-tab';
import { getDetailByType } from '@/services/apis/detail';
import FetchingFailedCard from '@/components/common/fetching-failed-card';

import { GetDetailResponse } from '@/services/apis/detail/dto';
import { getCommentList } from '@/services/apis/detail/comment';
import { GetCommentsResponse } from '@/services/apis/detail/comment/dto';

const config = {
	news: { allowComments: true, imagePosition: 'top' },
	board: { allowComments: true, imagePosition: 'bottom' },
};

// TODO: 내 팀 뉴스인지 확인, 뉴스에 있는 team pk와 내 팀 pk랑 비교
const DetailPage = async ({ params }: { params?: { type?: string; id?: string } }) => {
	if (!params?.type || !params?.id) return notFound();

	const { type, id } = params;

	if (!config[type]) return notFound(); // ✅ 유효한 type인지 확인

	const contents = (await getDetailByType(type as 'news' | 'board', Number(id))) as GetDetailResponse;
	console.log(contents.data); // TODO: 추후에는 이 상세 페이지 정보가 안 불러와지면 댓글까지 렌더링 안 되도록 if(!data) return(<FetchingFailedCard/>)

	const comments = (await getCommentList(Number(id), 1, 10, type === 'news')) as GetCommentsResponse;
	console.log(comments);

	const { allowComments, imagePosition } = config[type];
	const isOurTeamNews = true; // 임시

	return (
		<div className="flex flex-col gap-4">
			<ComponentFrame isMain={true}>
				{contents.data ? (
					<>
						<DetailContent
							data={contents.data}
							imagePosition={imagePosition}
							type={type}
							isOurTeamNews={isOurTeamNews}
						/>
					</>
				) : (
					<FetchingFailedCard height="800px" marginTop="200px" />
				)}
				{comments ? (
					<CommentSection
						type={type}
						allowComments={allowComments}
						isOurTeamNews={isOurTeamNews}
						comments={comments.data}
						contentsId={contents.data.pk}
					/>
				) : (
					<FetchingFailedCard height="300px" marginTop="50px" />
				)}
			</ComponentFrame>
			<RecommendedContent mode={type === 'news' ? '뉴스' : '게시글'} data={allNews} teamName="FC 서울" />
		</div>
	);
};

export default DetailPage;
