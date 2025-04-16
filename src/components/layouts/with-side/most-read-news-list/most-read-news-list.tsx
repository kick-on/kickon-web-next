import ComponentFrame from '@/components/common/component-frame';
import MostReadNewsItem from './most-read-news-item';
import { getHotNews } from '@/services/apis/news/getHotNews';
import FetchingFailedCard from '@/components/common/fetching-failed-card';

export default async function MostReadNewsList() {
	const response = await getHotNews();

	return (
		<div id="most-read-news-list">
			<ComponentFrame>
				<div className="pl-4 py-6 title5-semibold">많이 본 뉴스 TOP5</div>
				{!response || !response.data.length ? (
					<FetchingFailedCard height="28.75rem" marginTop="5.625rem" />
				) : (
					response.data.map((data) => <MostReadNewsItem key={data.pk} {...data} />)
				)}
			</ComponentFrame>
		</div>
	);
}
