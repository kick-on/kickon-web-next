'use client';

import ComponentFrame from '@/components/common/component-frame';
import MostReadNewsItem from './most-read-news-item';
import { getHotNews } from '@/services/apis/news/getHotNews';
import FetchingFailedCard from '@/components/common/fetching-failed-card';
import { useEffect, useState } from 'react';
import { HotNewsDto } from '@/services/apis/news/dto';

export default function MostReadNewsList() {
	const [news, setNews] = useState<HotNewsDto[] | null>(null);

	const getNews = async () => {
		const response = await getHotNews();
		if (response) {
			setNews(response.data);
		}
	};

	useEffect(() => {
		getNews();
	}, []);

	return (
		<div id="most-read-news-list">
			<ComponentFrame>
				<div className="pl-4 py-6 title5-semibold">많이 본 뉴스 TOP5</div>
				{!news || !news.length ? (
					<FetchingFailedCard onClick={getNews} height="28.75rem" marginTop="5.625rem" />
				) : (
					news.map((data) => <MostReadNewsItem key={data.pk} {...data} />)
				)}
			</ComponentFrame>
		</div>
	);
}
