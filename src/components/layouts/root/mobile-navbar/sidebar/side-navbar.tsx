'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Divider from './divider';
import { HotNewsDto } from '@/services/apis/news/dto';
import { useEffect, useState } from 'react';
import MostReadNewsItem from '@/components/layouts/with-side/most-read-news-list/most-read-news-item';
import { getHotNews } from '@/services/apis/news/getHotNews';
import Image from 'next/image';

export default function SideNavbar({ onClickButton }: { onClickButton: () => void }) {
	const pathname = usePathname();
	const [hotNews, setHotNews] = useState<HotNewsDto[]>([]);

	const navButtons = [
		{ herf: '/', content: '홈', isActive: pathname === '/' },
		{ herf: '/news?q=전체', content: '뉴스', isActive: pathname.split('/').includes('news') },
		{ herf: '/board?q=전체', content: '클럽 커뮤니티', isActive: pathname.split('/').includes('board') },
		{ herf: '/ranking', content: '랭킹', isActive: pathname === '/ranking' },
	];

	useEffect(() => {
		const getHotNewsItem = async () => {
			const response = await getHotNews();

			if (response) setHotNews(response.data);
		};

		getHotNewsItem();
	}, []);

	return (
		<div className="flex flex-col gap-[39px]">
			<nav className="flex flex-col gap-2">
				{navButtons.map((button) => (
					<Link
						onClick={onClickButton}
						key={button.content}
						href={button.herf}
						className={clsx('w-[calc(100%+32px)] -ml-4 py-2.5 px-5.5 active:bg-black-200 transition-colors', {
							'text-primary-900 button2-semibold': button.isActive,
						})}
					>
						{button.content}
					</Link>
				))}
			</nav>

			{hotNews.length !== 0 && (
				<>
					<Divider />

					<div className="flex flex-col gap-4">
						<span className="text-black-700 subtitle1-medium mb-1">많이 본 뉴스</span>
						{hotNews.map((news, i) => (i > 3 ? null : <MostReadNewsItem key={news.pk} {...news} />))}
					</div>
				</>
			)}

			<div className="absolute z-60 -bottom-[3.625rem] right-9 w-[15.9375rem] h-[12.75rem] opacity-[0.08]">
				<Image className="w-auto h-auto object-contain" src={'/logo/icon-red.svg'} alt="킥온 로고" fill />
			</div>
		</div>
	);
}
