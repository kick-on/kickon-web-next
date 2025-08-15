'use client';

import Player from '@/components/features/halftime/player';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { getHalftimeDetail } from '@/services/apis/shorts/shorts.api';
import { GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SwiperSlide, Swiper } from 'swiper/react';

export default function Page() {
	const [halftimes, setHalftimes] = useState<GetHalftimeDetailDto[]>([]);

	const router = useRouter();
	const params = useParams();
	const { id: pk } = params;

	useEffect(() => {
		const storedPks = sessionStorage.getItem('KICKON_HALFTIME_PKS');
		if (!storedPks || typeof pk !== 'string') return;
		const parsedPks = JSON.parse(storedPks);

		const getHalftime = async (pkStr: string) => {
			try {
				const pk = Number(pkStr);
				const response = await getHalftimeDetail(pk);
				setHalftimes((prev) => [...prev, response.data]);
			} catch {
				alert('동영상을 불러오는 중 문제가 발생했습니다.');
			}
		};

		const currentIndex = Number(parsedPks.findIndex((parsedPk) => parsedPk == pk));

		// 마지막 동영상인 경우 return
		if (currentIndex === parsedPks.length - 1) return;

		const nextPkIndex = currentIndex + 1;
		const nextPk = parsedPks[nextPkIndex];

		// 초기 렌더링 시에만 current와 next 모두 조회
		if (halftimes.length === 0) {
			getHalftime(pk);
		}
		getHalftime(nextPk);
	}, [pk]);

	// 동영상 전체 플로우에서의 mute 설정
	const [globalMuted, setGlobalMuted] = useState(true);

	const toggleGlobalMuted = () => {
		setGlobalMuted((prev) => !prev);
	};

	// margin top 조정 로직
	const [isMobileNavbar, setIsMobileNavber] = useState(false);
	const isLeftSideVisible = !useIsLeftSideVisible();

	useEffect(() => {
		setIsMobileNavber(isLeftSideVisible);
	}, [isLeftSideVisible]);

	return (
		<div
			className={clsx(
				'w-full min-h-150 overflow-scroll no-scrollbar',
				isMobileNavbar ? 'h-dvh' : 'h-[calc(100dvh-72px)]',
			)}
		>
			<Swiper
				cssMode
				className="w-full h-full"
				direction="vertical"
				slidesPerView={1.2}
				spaceBetween={24}
				centeredSlides
				onSlideChange={({ activeIndex }) => router.replace(`/halftime/${halftimes[activeIndex].pk}`)}
			>
				{halftimes.map((halftime) => (
					<SwiperSlide key={halftime.pk} className="desktop:px-22 w-full">
						{({ isActive }) => (
							<div className="mx-auto w-auto h-full aspect-[14/25] @mobile:h-full @mobile:w-full @mobile:aspect-auto rounded-lg bg-black-300">
								<Player
									{...halftime}
									isCurrentPlayer={isActive}
									globalMuted={globalMuted}
									toggleGlobalMuted={toggleGlobalMuted}
								/>
							</div>
						)}
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
