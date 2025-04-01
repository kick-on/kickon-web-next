import NewsItem from './news-item';
import CommunityItem from './community-item';
import CommunityDivisionBar from './community-division-bar';
import { getNewsList } from '@/services/apis/news/getNewsList';
import { getBoardList } from '@/services/apis/news/getBoardList';
import FetchingFailedCard from '../fetching-failed-card';
import TabBar from './tab-bar';

const renderItems = (items, ItemComponent) => (
	<div>
		{items.map((item, index) => (
			<div key={item.id}>
				<ItemComponent {...item} />
				{index !== items.length - 1 && <hr className="border-black-300 mx-4" />}
			</div>
		))}
	</div>
);

export default async function CategoryTab({
	mode,
	q,
	type,
	id,
}: {
	mode: 'news' | 'board';
	q: string;
	type: string;
	id: string;
}) {
	const isNews = mode === 'news';

	const request = {
		team: type === 'team' ? parseInt(id) : undefined,
		size: isNews ? 10 : 20,
		page: 1,
		order: q === '인기' ? 'hot' : 'recent',
		league: type === 'league' ? parseInt(id) : undefined,
	};
	const response = isNews ? await getNewsList(request) : await getBoardList(request);

	return (
		<div className="flex flex-col w-full">
			<TabBar mode={mode} q={q} />
			{!isNews && <CommunityDivisionBar />}
			{!response ? (
				<FetchingFailedCard height="770px" marginTop="9.5rem" />
			) : (
				renderItems(response.data, isNews ? NewsItem : CommunityItem)
			)}
		</div>
	);
}
