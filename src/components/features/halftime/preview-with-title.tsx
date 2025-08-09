'use client';

import { formatNumberByUnit } from '@/lib/utils/number/formatNumberByUnit';
import { BaseHalftimeDto } from '@/services/apis/shorts/shorts.type';
import Image from 'next/image';
import Link from 'next/link';
import Preview from './preview';

export default function PreviewWithTitle({
	pk,
	videoUrl,
	title,
	viewCount,
	kickCount,
}: Pick<BaseHalftimeDto, 'pk' | 'videoUrl' | 'title' | 'viewCount' | 'kickCount'>) {
	return (
		<Link key={pk} href={`/halftime/${pk}`} className="w-full h-auto aspect-[13/25]">
			<div className="w-full h-auto aspect-[13/20] rounded-lg overflow-hidden">
				<Preview src={videoUrl} />
			</div>

			<h3 className="button2-medium my-2 @mobile:mb-1.5 @mobile:text-14">
				{title.length > 27 ? title.slice(0, 27) + '...' : title}
			</h3>
			<div className="body5-regular text-black-600 flex gap-2 @mobile:text-12 items-center">
				<span>조회수 {formatNumberByUnit(viewCount)}회</span>
				<div className="h-3 w-px bg-black-600 @mobile:hidden" />
				<span className="flex gap-1.5 items-center @mobile:hidden">
					<Image src={'/kick/gray.svg'} alt="" width={16} height={16} />킥 {formatNumberByUnit(kickCount)}
				</span>
			</div>
		</Link>
	);
}
