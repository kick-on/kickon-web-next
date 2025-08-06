'use client';

import FetchingFailedCard from '@/components/common/fetching-failed-card';
import TopNewsItem, { TopNewsItemProps } from './top-news-item';
import { useEffect, useState } from 'react';
import { getHotNews, getNewsList } from '@/services/apis/news/news.api';

export default function TopNews() {
	const [news, setNews] = useState<TopNewsItemProps[] | null>(null);

	useEffect(() => {
		const getNews = async () => {
			const hotNewsResponse = await getHotNews();
			const isEmptyNews = hotNewsResponse?.data?.length === 0;

			if (!hotNewsResponse) setNews(null); // 데이터 페칭 실패
			if (isEmptyNews) {
				// top5 뉴스 없음 -> 최신 뉴스 조회
				const recentNewsResponse = await getNewsList({ order: 'recent', size: 5, page: 1 });
				if (recentNewsResponse) {
					const recentNews = recentNewsResponse.data.map((data) => ({
						...data,
						leagueNameKr: data?.team?.leagueNameKr,
					}));
					setNews(recentNews);
				}
			} else {
				setNews(hotNewsResponse.data);
			}
		};

		getNews();
	}, []);

	return (
		<div>
			{!news ? (
				<FetchingFailedCard height="28.875rem" marginTop="5.625rem" />
			) : (
				news.map((data) => <TopNewsItem key={data.pk} {...data} />)
			)}
		</div>
	);
}
