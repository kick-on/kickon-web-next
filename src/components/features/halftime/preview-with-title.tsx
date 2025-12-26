'use client';

import { formatNumberByUnit } from '@/lib/utils';
import { BaseHalftimeDto, HalftimeSortType } from '@/services/apis/shorts/shorts.type';
import Link from 'next/link';
import Preview from './preview';
import KickIcon from '@/assets/common/kick/fill-white.svg';

export default function PreviewWithTitle({
	pk,
	videoUrl,
	title,
	viewCount,
	kickCount,
	hasKick,
	ref,
	sort,
}: Pick<BaseHalftimeDto, 'pk' | 'videoUrl' | 'title' | 'viewCount' | 'kickCount'> & {
	hasKick?: boolean;
	ref?: React.RefObject<any>;
	sort?: HalftimeSortType;
}) {
	return (
		<Link ref={ref} key={pk} href={`/halftime/${pk}${sort ? `?sort=${sort}` : ''}`}>
			<div className="w-full h-auto aspect-[13/20] rounded-lg overflow-hidden">
				<Preview src={videoUrl} />
			</div>

			<h3 className="button2-medium my-2 @mobile:mb-1.5 @mobile:text-14 line-clamp-2 break-keep">{title}</h3>
			<div className="body5-regular text-black-600 flex gap-2 @mobile:text-12 items-center">
				<span>조회수 {formatNumberByUnit(viewCount)}회</span>
				{hasKick && (
					<>
						<div className="h-3 w-px bg-black-600" />
						<span className="flex gap-1.5 items-center">
							<KickIcon className="text-[#8F8F8F]" width={16} height={16} />킥 {formatNumberByUnit(kickCount)}
						</span>
					</>
				)}
			</div>
		</Link>
	);
}
