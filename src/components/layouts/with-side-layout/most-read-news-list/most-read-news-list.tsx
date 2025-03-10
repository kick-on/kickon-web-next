import ComponentFrame from '@/components/common/componentFrame';
import MostReadNewsItem from './most-read-news-item';

export default function MostReadNewsList() {
	return (
		<div id="most-read-news-list">
			<ComponentFrame>
				<div className="pl-4 py-6 title5-semibold">많이 본 뉴스 TOP5</div>
				<MostReadNewsItem />
				<MostReadNewsItem />
				<MostReadNewsItem />
				<MostReadNewsItem />
				<MostReadNewsItem />
			</ComponentFrame>
		</div>
	);
}
