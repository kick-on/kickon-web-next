'use client';

import Preview from '@/components/features/halftime/preview';
import { formatNumberByUnit } from '@/lib/utils/number/formatNumberByUnit';
import { getTodaysHalftime } from '@/services/apis/shorts/shorts.api';
import { GetTodaysHalftimeDto } from '@/services/apis/shorts/shorts.type';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopHalftime() {
	const [videos, setVideos] = useState<GetTodaysHalftimeDto[]>([]);

	useEffect(() => {
		const getVideos = async () => {
			const response = await getTodaysHalftime();
			if (response) {
				setVideos(response.data);
			}
		};

		getVideos();
	}, []);

	return (
		<div className="grid grid-cols-2 grid-rows-2 gap-2.5">
			{videos.map(({ s3Key, usedIn, referencePk, viewCount }) => (
				<Link
					key={s3Key}
					href={`/halftime/${usedIn.toLocaleLowerCase()}-${referencePk}`}
					className="relative rounded-lg overflow-hidden"
				>
					<div
						className="absolute z-15 bottom-0 w-full p-3 pt-5 text-black-000 body5-medium"
						style={{
							background: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(128, 128, 128, 0.15) 45.22%, rgba(0, 0, 0, 0.30) 100%)`,
						}}
					>
						조회수 {formatNumberByUnit(viewCount)}회
					</div>
					<Preview src={s3Key} />
				</Link>
			))}
		</div>
	);
}
