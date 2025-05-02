'use client';

import Image from 'next/image';
import CommunityDivisionBar from './category-tab/community-division-bar';
import CommunityItem from './category-tab/community-item';
import ComponentFrame from './component-frame';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { RecommendedNewsDto } from '@/services/apis/news/dto';
import { RecommendedBoardDto } from '@/services/apis/board/dto';
import { getRecommendedNews } from '@/services/apis/news/getRecommendedNews';
import { getRecommendedBoards } from '@/services/apis/board/getRecommendedBoards';
import FetchingFailedCard from './fetching-failed-card';
import Link from 'next/link';
import NewsItem from './category-tab/news-item';
import useIsMobile from '@/lib/hooks/useIsMobile';

const RecommendedContent = ({ mode, teamLogo = '', teamName = '' }) => {
	const pathname = usePathname();
	const [data, setData] = useState<RecommendedNewsDto[] | RecommendedBoardDto[] | null>(null);
	const isMobile = useIsMobile();

	const isMyTeam = Boolean(teamName);
	const isNews = mode === 'news';
	const isHome = pathname === '/';
	const Component = isNews ? NewsItem : CommunityItem;

	const displayTitle =
		pathname === '/' && !isNews ? (
			'클럽 커뮤니티'
		) : (
			<>
				{!isMobile ? (
					<div>
						함께 볼 만한 {isMyTeam && <span className="text-primary-900">{teamName} </span>}
						{isNews ? '뉴스' : '게시글'}
					</div>
				) : (
					<div className="flex">
						함께 볼 만한
						{isMyTeam && (
							<span className="text-primary-900 flex mx-1 items-center">
								MY 팀
								<Image width={16} height={16} src={teamLogo} alt="팀 로고" className="w-4 h-4 ml-1" />
							</span>
						)}
						{isNews ? '뉴스' : '게시글'}
					</div>
				)}
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
		<ComponentFrame className="@mobile:mb-10" isMain={true}>
			<header
				className={clsx('flex mx-4 @mobile:mx-0 justify-between pt-7.5 @mobile:pt-6 pb-1.5', {
					'border-b border-black-300 pb-7.5': !isNews,
				})}
			>
				<h3 className="@mobile:ml-4 @mobile:text-[16px] title4-semibold">{displayTitle}</h3>

				<Link
					href={!isNews ? '/board?q=전체' : isMyTeam ? `/news?q=${teamName}` : `/news?q=전체`}
					aria-label="더 보기"
					className="@mobile:mr-4 @mobile:text-[12px] flex gap-2 items-center text-black-700 body5-regular"
				>
					<span>더 보기</span>
					<Image
						src="/chevron/right-gray.svg"
						width={18}
						height={18}
						className="@mobile:w-4 @mobile:h-4"
						alt="오른쪽 화살표"
					/>
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
							{index !== data.length - 1 && (
								<hr className={clsx('border-black-300 mx-4', { '@mobile:mx-0': Component === CommunityItem })} />
							)}
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
