'use client';

import Image from 'next/image';
import CommunityDivisionBar from './category-tab/community-division-bar';
import CommunityItem from './category-tab/community-item';
import ComponentFrame from './component-frame';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { NewsListDto } from '@/services/apis/news/news.type';
import { BoardListDto } from '@/services/apis/board/board.type';
import { getRecommendedNews } from '@/services/apis/news/news.api';
import { getRecommendedBoard } from '@/services/apis/board/board.api';
import FetchingFailedCard from './fetching-failed-card';
import Link from 'next/link';
import NewsItem from './category-tab/news-item';

const RecommendedContent = ({ mode, teamName = '' }) => {
	const pathname = usePathname();
	const [data, setData] = useState<NewsListDto[] | BoardListDto[] | null>(null);
	const isMyTeam = Boolean(teamName);
	const isNews = mode === 'news';
	const isHome = pathname === '/';
	const Component = isNews ? NewsItem : CommunityItem;

	const displayTitle =
		(pathname === '/' && isNews) || isNews ? (
			<div className="flex">
				함께 볼 만한
				{isMyTeam && <span className="text-primary-900 flex mx-1.5 items-center">MY 팀</span>} 뉴스
			</div>
		) : pathname === '/' ? (
			'클럽 커뮤니티'
		) : (
			'함께 볼 만한 게시글'
		);

	const getDatas = useCallback(async () => {
		const response = isNews
			? await getRecommendedNews({ type: teamName ? undefined : 'all' })
			: await getRecommendedBoard();

		if (!response) {
			setData(null);
		} else {
			// 커뮤니티 아이템인 경우에만 isPinned 기준으로 정렬
			if (!isNews && Array.isArray(response.data)) {
				const sortedData = [...(response.data as BoardListDto[])].sort((a, b) => {
					// isPinned가 true인 항목을 상단으로 배치
					if (a.isPinned && !b.isPinned) return -1;
					if (!a.isPinned && b.isPinned) return 1;
					return 0; // 같은 경우 원래 순서 유지
				});
				setData(sortedData);
			} else {
				setData(response.data);
			}
			console.log(response.data);
		}
	}, [isNews, teamName]);

	useEffect(() => {
		getDatas();
	}, [isHome, isNews, isMyTeam, getDatas]);

	return (
		<ComponentFrame isMain={true}>
			<header
				className={clsx(
					'flex px-4 justify-between pb-1.5',
					isNews ? '@mobile:pt-6 pt-7.5' : 'pt-7.5',
					!isNews && 'border-b pb-7.5',
					!isNews && 'border-black-700 @mobile:border-black-200',
				)}
			>
				<h3 className={clsx('title4-semibold', isNews ? '@mobile:text-16' : '@mobile:text-18')}>{displayTitle}</h3>

				<Link
					href={!isNews ? '/board?q=전체' : isMyTeam ? `/news?q=${teamName}` : `/news?q=전체`}
					aria-label="더 보기"
					className="@mobile:text-[12px] flex gap-2 items-center text-black-700 body5-regular"
				>
					<span>더 보기</span>
					<Image src="/chevron/right-gray.svg" width={18} height={18} className="@mobile:w-4 @mobile:h-4" alt="" />
				</Link>
			</header>

			{!isNews && <CommunityDivisionBar />}

			<div className="flex flex-col">
				{!data ? (
					<FetchingFailedCard
						onClick={getDatas}
						height={isNews ? '45.375rem' : '35.125rem'}
						marginTop={isNews ? '14.4375rem' : '10.25rem'}
					/>
				) : (
					data.map((item, index) => (
						<div key={item.pk}>
							<Component {...item} isMyTeam={isMyTeam} />
							{index !== data.length - 1 && <hr className={clsx('border-black-200', { 'mx-4': isNews })} />}
						</div>
					))
				)}
				{Array.isArray(data) && data.length === 0 && (
					<p className="h-74 text-center body4-regular text-black-500 pt-32.5">
						추천할 {isNews ? '뉴스가' : '게시글이'} 아직 없어요.
					</p>
				)}
			</div>
		</ComponentFrame>
	);
};

export default RecommendedContent;
