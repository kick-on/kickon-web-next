'use client';

import Image from 'next/image';
import ComponentFrame from '../../common/component-frame';
import Link from 'next/link';
import { getTodaysHalftime } from '@/services/apis/shorts/shorts.api';
import { useEffect, useState } from 'react';
import { BaseHalftimeDto } from '@/services/apis/shorts/shorts.type';
import PreviewWithTitle from '../halftime/preview-with-title';

export default function TodaysHalftime() {
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

	return (
		<ComponentFrame isMain className="pt-[1.875rem] px-4 pb-6">
			<header className="flex justify-between mb-[1.875rem]">
				<h3 className="title4-semibold @mobile:text-16">오늘의 하프타임🔥</h3>
				<Link
					href={'/halftime'}
					aria-label="더 보기"
					className="@mobile:text-[12px] flex gap-2 items-center text-black-700 body5-regular"
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

			{videos.length ? (
				<div className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-4">
					{videos.map((video) => (
						<PreviewWithTitle key={video.pk} {...video} />
					))}
				</div>
			) : (
				<Link href={'/halftime'} className="py-10 text-center text-body-03 text-black-7800">
					모든 하프타임 둘러보러 가기 &gt;
				</Link>
			)}
		</ComponentFrame>
	);
}
