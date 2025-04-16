import { HotNewsDto } from '@/services/apis/news/dto';
import Image from 'next/image';
import Link from 'next/link';

export default function MostReadNewsItem({ pk, title, leagueNameKr, thumbnailUrl }: HotNewsDto) {
	return (
		<Link href={`/news/${pk}`} className="grid grid-cols-[auto_1fr] gap-2 border-t border-black-200 p-4">
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
