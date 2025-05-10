'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Divider from './divider';
import { HotNewsDto, NewsItemDto } from '@/services/apis/news/dto';
import { useEffect, useState } from 'react';
import MostReadNewsItem from '@/components/layouts/with-side/most-read-news-list/most-read-news-item';
import { getHotNews } from '@/services/apis/news/getHotNews';
import Image from 'next/image';
import { getNewsList } from '@/services/apis/news/getNewsList';

export default function SideNavbar({ onClickButton }: { onClickButton: () => void }) {
	const pathname = usePathname();

	const [countToRender, setCountToRender] = useState<number | null>(null);
	const [hotNews, setHotNews] = useState<HotNewsDto[] | null>(null);
	const [recentNews, setRecentNews] = useState<NewsItemDto[] | null>(null);

	const isHotNewsEmpty = hotNews && hotNews.length === 0;

	const navButtons = [
		{ href: '/', content: '홈', isActive: pathname === '/' },
		{ href: '/news?q=전체', content: '뉴스', isActive: pathname.split('/').includes('news') },
		{ href: '/board?q=전체', content: '클럽 커뮤니티', isActive: pathname.split('/').includes('board') },
		{ href: '/ranking', content: '랭킹', isActive: pathname === '/ranking' },
	];

	useEffect(() => {
		if (countToRender === null) return;

		const getHotNewsItem = async () => {
			const hotNewsResponse = await getHotNews();

			if (hotNewsResponse) {
				setHotNews(hotNewsResponse.data.slice(0, countToRender));

				// 많이 본 뉴스가 빈 배열인 경우 최신 뉴스 렌더링
				if (hotNewsResponse.data.length === 0) {
					const recentNewsResponse = await getNewsList({ order: 'recent', size: countToRender, page: 1 });
					if (recentNewsResponse) {
						setRecentNews(recentNewsResponse.data);
					}
				}
			}
		};

		getHotNewsItem();
	}, [countToRender]);

	useEffect(() => {
		if (window.innerHeight < 668) setCountToRender(2);
		else if (window.innerHeight < 768) setCountToRender(3);
		else if (window.innerHeight < 846) setCountToRender(4);
		else setCountToRender(5);
	}, []);

	return (
		<div className="flex flex-col justify-between h-full">
			<nav className="flex flex-col gap-2">
				{navButtons.map((button) => (
					<Link
						onClick={() => setTimeout(onClickButton, 200)}
						key={button.content}
						href={button.href}
						className={clsx('w-[calc(100%+32px)] -ml-4 py-2.5 px-5.5 active:bg-black-200 transition-colors', {
							'text-primary-900 button2-semibold': button.isActive,
						})}
					>
						{button.content}
					</Link>
				))}
			</nav>

			{hotNews !== null && (
				<>
					<Divider />

					<div className="relative z-20 flex flex-col gap-4 mb-18">
						<span className="text-black-700 subtitle1-medium mb-1 mt-2">
							{isHotNewsEmpty ? '최신 뉴스' : '많이 본 뉴스'}
						</span>
						{isHotNewsEmpty
							? recentNews !== null
								? recentNews.map((news) => (
										<div key={news?.pk} onClick={onClickButton}>
											<MostReadNewsItem {...news} leagueNameKr={news?.category} />
										</div>
									))
								: null
							: hotNews.map((news, i) =>
									i > countToRender - 1 ? null : (
										<div key={news.pk} onClick={onClickButton}>
											<MostReadNewsItem {...news} />
										</div>
									),
								)}
					</div>
				</>
			)}

			<div className="absolute z-10 -bottom-[3.625rem] right-9 w-[15.9375rem] h-[12.75rem] opacity-[0.08]">
				<Image className="w-auto h-auto object-contain" src={'/logo/icon-red.svg'} alt="킥온 로고" fill />
			</div>
		</div>
	);
}
