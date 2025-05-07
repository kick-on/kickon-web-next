'use client';

import { useEffect, useRef, useState } from 'react';
import { getNewsList } from '@/services/apis/news/getNewsList';
import { getBoardList } from '@/services/apis/board/getBoardList';
import NewsItem from './news-item';
import CommunityItem from './community-item';
import { renderItems } from './category-tab';
import getServerDeviceType from '@/lib/utils/getServerDeviceType';
import { GetNewsListRequest } from '@/services/apis/news/dto';
import { GetBoardListRequest } from '@/services/apis/board/dto';
import { MetaDto } from '@/services/config/dto';

export interface MoreListProps {
	mode: 'news' | 'board';
	initialLastPk: number;
	initialLastViewCount: number;
	initialRequest: GetNewsListRequest | GetBoardListRequest;
	initialMeta: MetaDto;
}

export default function MoreList({
	mode,
	initialLastPk,
	initialLastViewCount,
	initialRequest,
	initialMeta,
}: MoreListProps) {
	const [items, setItems] = useState([]);
	const [lastPk, setLastPk] = useState(initialLastPk);
	const [lastViewCount, setLastViewCount] = useState(initialLastViewCount);
	const [page, setPage] = useState(initialMeta.currentPage + 1);
	const [hasNext, setHasNext] = useState(initialMeta.totalItems - initialMeta.pageSize * initialMeta.currentPage > 0);

	const { isMobile } = getServerDeviceType();

	const isNews = mode === 'news';
	const itemComponent = isNews ? NewsItem : CommunityItem;

	const observerRef = useRef<IntersectionObserver | null>(null);
	const targetRef = useRef<HTMLDivElement | null>(null);
	const [isIntersecting, setIsIntersecting] = useState(false);

	useEffect(() => {
		if (!targetRef.current) return;

		observerRef.current = new IntersectionObserver(([entry]) => {
			setIsIntersecting(entry.isIntersecting);
			console.log('intersecting: ', entry.isIntersecting);
			console.log('hasNext: ', hasNext);
		});

		observerRef.current.observe(targetRef.current);

		return () => {
			if (observerRef.current) observerRef.current.disconnect();
		};
	}, [targetRef]);

	useEffect(() => {
		const getItems = async () => {
			const request = {
				...initialRequest,
				page: page,
				infinite: isMobile ? true : undefined,
				lastNews: isMobile && isNews ? lastPk : undefined,
				lastBoard: isMobile && !isNews ? lastPk : undefined,
				lastViewCount: isMobile && initialRequest.order === 'hot' ? lastViewCount : undefined,
			};

			const response = isNews ? await getNewsList(request) : await getBoardList(request);
			console.log(response.data.at(-1)?.pk);
			if (!response || response.data.length === 0) return;

			setItems((prev) => [...prev, ...response.data]);
			setLastPk(response.data.at(-1)?.pk || 0);
			setLastViewCount(response.data.at(-1)?.views || 0);

			setPage(page + 1);
			setHasNext(response.meta.hasNext);
		};

		if (hasNext && isIntersecting) {
			getItems();
		}
	}, [isIntersecting]);

	return isMobile ? (
		<>
			{renderItems(items, itemComponent)}
			<div ref={targetRef} style={{ height: 1 }} /> {/* 감지용 div */}
		</>
	) : null;
}
