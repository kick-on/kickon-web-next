'use client';

import Image from 'next/image';
import Preview from '../halftime/preview';
import ComponentFrame from '../../common/component-frame';
import Link from 'next/link';
import { getTodaysHalftime } from '@/services/apis/shorts/shorts.api';
import { useEffect, useState } from 'react';
import { GetTodaysHalftimeDto } from '@/services/apis/shorts/shorts.type';

export default function TodaysHalftime() {
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

			{/* TODO: Link 전체를 Preview로 컴포넌트화 */}
			<div className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-4">
				{videos.map(({ s3Key, usedIn, referencePk, title, viewCount, kickCount }) => (
					<Link
						key={s3Key}
						href={`/halftime/${usedIn.toLocaleLowerCase()}-${referencePk}`}
						className="w-full h-auto aspect-[13/25]"
					>
						<div className="w-full h-auto aspect-[13/20] rounded-lg overflow-hidden">
							<Preview src={s3Key} />
						</div>

						<h3 className="button2-medium my-2 @mobile:mb-1.5 @mobile:text-14">
							{title.length > 27 ? title.slice(0, 27) + '...' : title}
						</h3>
						<div className="body5-regular text-black-600 flex gap-2 @mobile:text-12 items-center">
							<span>조회수 {viewCount}회</span>
							<div className="h-3 w-px bg-black-600" />
							<span className="flex gap-1.5 items-center">
								<Image src={'/kick/gray.svg'} alt="" width={16} height={16} />킥 {kickCount}
							</span>
						</div>
					</Link>
				))}
			</div>
		</ComponentFrame>
	);
}
