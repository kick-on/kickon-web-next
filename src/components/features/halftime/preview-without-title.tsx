import { formatNumberByUnit } from '@/lib/utils/number/formatNumberByUnit';
import { BaseHalftimeDto } from '@/services/apis/shorts/shorts.type';
import Preview from './preview';
import Link from 'next/link';

export default function PreviewWithoutTitle({ pk, videoUrl, viewCount }: Partial<BaseHalftimeDto>) {
	return (
		<Link
			key={pk}
			href={`/halftime/${pk}`}
			className="relative rounded-lg overflow-hidden w-full h-auto aspect-[13/20] "
		>
			<div
				className="absolute z-15 bottom-0 w-full p-3 pt-5 text-black-000 body5-medium"
				style={{
					background: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(128, 128, 128, 0.15) 45.22%, rgba(0, 0, 0, 0.30) 100%)`,
				}}
			>
				조회수 {formatNumberByUnit(viewCount)}회
			</div>
			<Preview src={videoUrl} />
		</Link>
	);
}
