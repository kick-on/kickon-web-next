import NewsItem from './news-item';
import CommunityItem from './community-item';
import CommunityDivisionBar from './community-division-bar';
import { getNewsList } from '@/services/apis/news/getNewsList';
import { getBoardList } from '@/services/apis/news/getBoardList';
import FetchingFailedCard from '../fetching-failed-card';
import TabBar from './tab-bar';
import PaginationBar from '../pagination-bar.tsx/pagination-bar';
import Image from 'next/image';
import Link from 'next/link';

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
			) : !response.data.length ? (
				<div className="flex flex-col mt-[9.9375rem] items-center">
					<Image width={120} height={74} src={'/goal-post.svg'} alt={'골대 이미지'} />
					<span className="mt-[2.375rem] mb-4 body2-semibold">아직 작성된 게시글이 없어요.</span>
					<span className="mb-9 body5-regular">{isNews ? '뉴스' : '클럽 커뮤니티'} 게시글의 첫 키커가 되어주세요!</span>
					<Link
						className="flex gap-1.5 body7-regular text-black-700 mb-[30.625rem]"
						href={`/post/${isNews ? 'news' : 'board'}`}
					>
						작성하러 가기 <Image width={16} height={16} src={'/chevron/right-gray.svg'} alt="바로가기" />
					</Link>
				</div>
			) : (
				<div className="flex flex-col w-full pb-10">
					{renderItems(response.data, isNews ? NewsItem : CommunityItem)}
					<PaginationBar totalPages={response.meta.totalPages} baseUrl={`/${mode}`} />
				</div>
			)}
		</div>
	);
}
