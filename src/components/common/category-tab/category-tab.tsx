import NewsItem from './news-item';
import CommunityItem from './community-item';
import CommunityDivisionBar from './community-division-bar';
import { getNewsList } from '@/services/apis/news/getNewsList';
import { getBoardList } from '@/services/apis/news/getBoardList';
import FetchingFailedCard from '../fetching-failed-card';
import TabBar from './tab-bar';
import PaginationBar from '../pagination-bar.tsx/pagination-bar';

const renderItems = (items, ItemComponent) => (
	<div className="mb-12">
		{items.map((item, index) => (
			<div key={item.pk}>
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
	page,
}: {
	mode: 'news' | 'board';
	q: string;
	type: string;
	id: string;
	page: string | undefined;
}) {
	const isNews = mode === 'news';

	const request = {
		team: type === 'team' ? parseInt(id) : undefined,
		size: isNews ? 10 : 20,
		page: page !== undefined ? parseInt(page) : 1,
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
				<>
					{renderItems(response.data, isNews ? NewsItem : CommunityItem)}
					<PaginationBar totalPages={response.meta.totalPages} baseUrl={`/${mode}`} />
				</>
			)}
		</div>
	);
}
