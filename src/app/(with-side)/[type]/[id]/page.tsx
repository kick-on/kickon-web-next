import { notFound } from 'next/navigation';
import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import DetailContent from '@/components/features/detail/content/DetailContent';
import CommentSection from '@/components/features/detail/comment/CommentSection';
import { allNews } from '@/components/common/category-tab/category-tab';
import { getNewsDetail } from '@/services/apis/detail';
import FetchingFailedCard from '@/components/common/fetching-failed-card';

const config = {
	news: { allowComments: true, imagePosition: 'top' },
	board: { allowComments: true, imagePosition: 'bottom' },
};

const DetailPage = async ({ params }: { params: { type: string; id: string } }) => {
	const { type, id } = params;
	if (!config[type]) return notFound();

	const data = await getNewsDetail(Number(id));
	if (!data) {
		console.log('데이터를 불러오지 못함:', data); // 디버깅용
		return (
			<ComponentFrame isMain={true}>
				<div className="w-full flex justify-center items-center py-10">
					<FetchingFailedCard height="856px" marginTop="200px" />
				</div>
			</ComponentFrame>
		);
	}

	const { allowComments, imagePosition } = config[type];
	const isOurTeamNews = false; // 하드코딩

	return (
		<div className="flex flex-col gap-4">
			<ComponentFrame isMain={true}>
				<DetailContent data={data} imagePosition={imagePosition} type={type} isOurTeamNews={isOurTeamNews} />
				<CommentSection allowComments={allowComments} isOurTeamNews={isOurTeamNews} />
			</ComponentFrame>
			<RecommendedContent mode="뉴스" data={allNews} teamName="FC 서울" />
		</div>
	);
};

export default DetailPage;
