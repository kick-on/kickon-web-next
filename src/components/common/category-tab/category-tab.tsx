import clsx from 'clsx';
import NewsItem from './news-item';
import PaginationBar from '../pagination-bar.tsx/pagination-bar';
import CommunityItem from './community-item';
import SelectBox from './select-box';
import Link from 'next/link';
import CommunityDivisionBar from './community-division-bar';
import { getNewsList } from '@/services/apis/news/getNewsList';
import { getBoardList } from '@/services/apis/news/getBoardList';
import FetchingFailedCard from '../fetching-failed-card';

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

export default async function CategoryTab({ mode, q }: { mode: 'news' | 'board'; q: string }) {
	const tabs = ['전체', '인기', 'FC서울'];
	const isNews = mode === 'news';

	const request = {
		team: q === tabs[2] ? 0 : undefined, // TODO: team pk를 어떻게 받아올지 -> query에 저장
		size: isNews ? 10 : 20,
		page: 1,
		order: q === '인기' ? 'hot' : 'recent',
		league: !tabs.includes(q) ? 0 : undefined, // TODO: league pk를 어떻게 받아올지 -> query에 저장
	};
	const response = isNews ? await getNewsList(request) : await getBoardList(request);

	return (
		<div className="flex flex-col w-full">
			<div className="flex gap-4 pt-[0.9375rem] pl-4 header-medium border-b border-black-300">
				{tabs.map((tab) => (
					<Link
						href={`/${mode}?q=${tab}`}
						key={tab}
						className={clsx('px-[0.5rem] py-[0.9375rem] border-b-2 border-transparent', {
							'border-primary-900 text-primary-900 header-semibold': q === tab,
						})}
					>
						{tab}
					</Link>
				))}
				{isNews && (
					<div
						className={clsx('border-b-2 border-transparent', {
							'border-primary-900 text-primary-900 header-semibold': !tabs.includes(q),
						})}
					>
						<SelectBox isClickedOtherTab={tabs.includes(q)} />
					</div>
				)}
			</div>
			{!isNews && <CommunityDivisionBar />}
			{!response ? (
				<FetchingFailedCard height="770px" marginTop="9.5rem" />
			) : (
				renderItems(response.data, isNews ? NewsItem : CommunityItem)
			)}
			<div className="flex mt-[3.75rem] mb-10 mx-auto">
				<PaginationBar />
			</div>
		</div>
	);
}
