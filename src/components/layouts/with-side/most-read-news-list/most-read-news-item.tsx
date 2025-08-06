'use client';

import useIsDesktop from '@/lib/hooks/useIsDesktop';
import { HotNewsDto } from '@/services/apis/news/news.type';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export type MostReadNewsItemProps = Pick<HotNewsDto, 'pk' | 'title' | 'leagueNameKr' | 'thumbnailUrl'>;

export default function MostReadNewsItem({ pk, title, leagueNameKr, thumbnailUrl }: MostReadNewsItemProps) {
	const isDesktop = useIsDesktop();

	return (
		<Link
			href={`/news/${pk}`}
			className={clsx(
				'grid grid-cols-[auto_1fr] gap-2 border-black-200',
				isDesktop ? 'not-first:border-t py-4' : 'border-0 p-0',
			)}
		>
			<Image
				width={80}
				height={60}
				src={thumbnailUrl}
				alt="기사 사진"
				className="w-20 h-[3.75rem] rounded-[0.25rem] object-cover"
			/>
			<div className="mr-2.5 my-auto body6-regular text-left line-clamp-3">
				<strong>[{leagueNameKr || '전체'}]</strong> {title}
			</div>
		</Link>
	);
}
