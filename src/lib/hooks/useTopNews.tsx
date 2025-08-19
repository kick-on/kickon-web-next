'use client';

import { TopNewsItemProps } from '@/components/layouts/with-side/top-news-halftime/top-news-item';
import { getHotNews, getNewsList } from '@/services/apis/news/news.api';
import { useEffect, useState } from 'react';

export default function useTopNews() {
	const [news, setNews] = useState<TopNewsItemProps[] | null>(null);
	const [newsTab, setNewsTab] = useState('많이 본 뉴스 TOP5');

	useEffect(() => {
		const getNews = async () => {
			const hotNewsResponse = await getHotNews();
			if (!hotNewsResponse) {
				// 데이터 페칭 실패
				setNews(null);
				return;
			}

			const isEmptyNews = hotNewsResponse.data.length === 0;
			if (isEmptyNews) {
				// top5 뉴스 없음 -> 최신 뉴스 조회
				const recentNewsResponse = await getNewsList({ order: 'recent', size: 5, page: 1 });
				if (recentNewsResponse) {
					const recentNews = recentNewsResponse.data.map((data) => ({
						...data,
						leagueNameKr: data?.team?.leagueNameKr || data.category,
					}));
					setNews(recentNews);
					setNewsTab('최신 뉴스 TOP5');
				}
			} else {
				setNews(hotNewsResponse.data);
			}
		};

		getNews();
	}, [setNewsTab]);

	return { news, newsTab };
}
