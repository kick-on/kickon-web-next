import NewsItem from './news-item';
import CommunityItem from './community-item';
import CommunityDivisionBar from './community-division-bar';
import { getNewsList } from '@/services/apis/news/getNewsList';
import { getBoardList } from '@/services/apis/board/getBoardList';
import FetchingFailedCard from '../fetching-failed-card';
import TabBar from './tab-bar';
import PaginationBar from '../pagination-bar';
import clsx from 'clsx';
import EmptyState from './empty-state';
import MoreList, { MoreListProps } from './more-list';

export const renderItems = (items, ItemComponent) => (
	<div>
		{items.map((item, index) => (
			<div key={item.pk}>
				<ItemComponent {...item} />
				{index !== items.length - 1 && (
					<hr className={clsx('border-black-300 mx-4', { '@mobile:mx-0': ItemComponent === CommunityItem })} />
				)}
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

	const moreListProps: MoreListProps = {
		mode: mode,
		initialLastPk: response.data.at(-1)?.pk || 0,
		initialLastViewCount: response.data.at(-1)?.views || 0,
		initialRequest: request,
		initialMeta: response.meta,
	};

	return (
		<div className="flex flex-col w-full @mobile:w-[calc(100vw-34px)]">
			<TabBar mode={mode} q={q} type={type} />
			{!isNews && <CommunityDivisionBar />}
			{!response ? (
				<FetchingFailedCard height="770px" marginTop="9.5rem" />
			) : !response.data.length ? (
				<EmptyState isNews={isNews} />
			) : (
				<div className="flex flex-col w-full pb-10 @mobile:pb-0">
					{renderItems(response.data, isNews ? NewsItem : CommunityItem)}
					<MoreList {...moreListProps} />
					<PaginationBar totalPages={response.meta.totalPages} baseUrl={`/${mode}`} />
				</div>
			)}
		</div>
	);
}
