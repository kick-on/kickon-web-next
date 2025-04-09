'use client';

import Image from 'next/image';
import CommunityDivisionBar from './category-tab/community-division-bar';
import CommunityItem from './category-tab/community-item';
import NewsItem from './category-tab/news-item';
import ComponentFrame from './componentFrame';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { RecommendedNewsDto } from '@/services/apis/news/dto';
import { RecommendedBoardDto } from '@/services/apis/board/dto';
import { getRecommendedNews } from '@/services/apis/news/getRecommendedNews';
import { getRecommendedBoards } from '@/services/apis/board/getRecommendedBoards';
import FetchingFailedCard from './fetching-failed-card';
import Link from 'next/link';

const RecommendedContent = ({ mode, teamName = '' }) => {
	const pathname = usePathname();
	const [data, setData] = useState<RecommendedNewsDto[] | RecommendedBoardDto[] | null>(null);

	const isMyTeam = Boolean(teamName);
	const isNews = mode === 'news';
	const isHome = pathname === '/';
	const Component = isNews ? NewsItem : CommunityItem;

	const displayTitle =
		pathname === '/' && !isNews ? (
			'클럽 커뮤니티'
		) : (
			<>
				함께 볼 만한 {isMyTeam && <span className="text-primary-900">{teamName} </span>}
				{isNews ? '뉴스' : '게시글'}
			</>
		);

	const getDatas = useCallback(async () => {
		const response = isNews
			? await getRecommendedNews({ type: teamName ? undefined : 'all' })
			: await getRecommendedBoards();

		if (!response) {
			setData(null);
		} else {
			setData(response.data);
			console.log(response.data);
		}
	}, [isNews, teamName]);

	useEffect(() => {
		getDatas();
	}, [isHome, isNews, isMyTeam, getDatas]);

	return (
		<ComponentFrame isMain={true}>
			<header
				className={clsx('flex mx-4 justify-between pt-7.5 pb-1.5', {
					'border-b border-black-300 pb-7.5': !isNews,
				})}
			>
				<h3 className="title4-semibold">{displayTitle}</h3>

				<Link
					href={!isNews ? '/board?q=전체' : isMyTeam ? `/news?q=${teamName}` : `/news?q=전체`}
					aria-label="더 보기"
					className="flex gap-2 items-center text-black-700 body5-regular"
				>
					<span>더 보기</span>
					<Image src="/chevron/right-gray.svg" width={18} height={18} alt="오른쪽 화살표" />
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
							{index !== data.length - 1 && <hr className="border-black-300 mx-4" />}
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
