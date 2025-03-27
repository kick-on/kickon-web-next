import { notFound } from 'next/navigation';
import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import DetailContent from '@/components/features/detail/content/DetailContent';
import CommentSection from '@/components/features/detail/comment/CommentSection';
import { allNews } from '@/components/common/category-tab/category-tab';

const config = {
	news: { allowComments: true, imagePosition: 'top' },
	board: { allowComments: true, imagePosition: 'bottom' },
};

const fetchDetailData = async (type: string, id: string) => {
	const mockDataMap = await import('@/lib/mock').then((mod) => mod.mockDataMap);
	return mockDataMap[type] || null;
};

const DetailPage = async ({ params }: { params: { type: string; id: string } }) => {
	const { type, id } = params;
	if (!config[type]) return notFound();

	const data = await fetchDetailData(type, id);
	if (!data) return notFound();

	const { allowComments, imagePosition } = config[type];
	const isOurTeamNews = data.isOurTeamNews ?? false;

	return (
		<div className="flex flex-col gap-4">
			<ComponentFrame isMain={true}>
				<DetailContent data={data} imagePosition={imagePosition} type={type} isOurTeamNews={isOurTeamNews} />
				<CommentSection allowComments={allowComments} isOurTeamNews={isOurTeamNews} />
			</ComponentFrame>
			<RecommendedContent mode="뉴스" data={allNews} teamName={data.teamName} />
		</div>
	);
};

export default DetailPage;
