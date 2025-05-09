import ComponentFrame from '@/components/common/component-frame';
import MostReadNewsItem from './most-read-news-item';
import { getHotNews } from '@/services/apis/news/getHotNews';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import { getNewsList } from '@/services/apis/news/getNewsList';

export default async function MostReadNewsList() {
	const hotNews = await getHotNews();
	const isEmptyNews = hotNews && hotNews.data.length === 0;
	const news = !hotNews
		? null // 데이터 페칭 실패 -> fetching failed card
		: isEmptyNews // 데이터가 빈 경우 -> 최신 뉴스 top5
			? await getNewsList({ order: 'recent', size: 5, page: 1 })
			: hotNews;

	return (
		<div id="most-read-news-list">
			<ComponentFrame>
				<div className="pl-4 py-6 title5-semibold">{isEmptyNews ? '최신 뉴스 TOP5' : '많이 본 뉴스 TOP5'}</div>
				{!news ? (
					<FetchingFailedCard height="28.75rem" marginTop="5.625rem" />
				) : (
					news.data.map((data) => <MostReadNewsItem key={data.pk} {...data} />)
				)}
			</ComponentFrame>
		</div>
	);
}
