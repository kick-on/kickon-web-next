'use client';

import FetchingFailedCard from '@/components/common/fetching-failed-card';
import TopNewsItem, { TopNewsItemProps } from './top-news-item';

export default function TopNews({ news }: { news: TopNewsItemProps[] }) {
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
