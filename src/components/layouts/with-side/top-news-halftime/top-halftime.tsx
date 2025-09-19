'use client';

import PreviewWithoutTitle from '@/components/features/halftime/preview-without-title';
import { getTodaysHalftime } from '@/services/apis/shorts/shorts.api';
import { BaseHalftimeDto } from '@/services/apis/shorts/shorts.type';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopHalftime() {
	const [videos, setVideos] = useState<BaseHalftimeDto[]>([]);

	useEffect(() => {
		const getVideos = async () => {
			const response = await getTodaysHalftime();
			if (response) {
				setVideos(response.data);
			}
		};

		getVideos();
	}, []);

	return videos.length ? (
		<div className="grid grid-cols-2 grid-rows-2 gap-2.5">
			{videos.map((video) => (
				<PreviewWithoutTitle key={video.pk} {...video} />
			))}
		</div>
	) : (
		<Link
			href={'/halftime'}
			className="flex items-center justify-center text-body-03 text-black-800 w-full aspect-[13/20] -mb-1"
		>
			모든 하프타임 둘러보러 가기 &gt;
		</Link>
	);
}
