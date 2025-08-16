'use client';

import Player from '@/components/features/halftime/player';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { useHalftimes } from '@/lib/store/useHalftimeStore';
import { getHalftimeDetail } from '@/services/apis/shorts/shorts.api';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SwiperSlide, Swiper, SwiperRef } from 'swiper/react';

export default function Page() {
	const { halftimes, pushHalftimes } = useHalftimes();

	const router = useRouter();
	const params = useParams();
	const { id: pk } = params;

	useEffect(() => {
		const storedPks = sessionStorage.getItem('KICKON_HALFTIME_PKS');
		if (!storedPks || typeof pk !== 'string') return;
		const parsedPks = JSON.parse(storedPks);

		const getHalftime = async (pkToFetch: number) => {
			// 이미 조회한 pk의 halftime은 조회하지 않음
			if (halftimes.some((h) => h.pk === pkToFetch)) {
				return;
			}

			try {
				const response = await getHalftimeDetail(pkToFetch);
				pushHalftimes(response.data);
			} catch {
				alert('동영상을 불러오는 중 문제가 발생했습니다.');
			}
		};

		const currentPkNum = Number(pk);
		getHalftime(currentPkNum);

		const currentIndex = parsedPks.findIndex((parsedPk: string) => parsedPk == pk);
		const isLastVideo = currentIndex === parsedPks.length - 1;

		if (!isLastVideo) {
			const nextPkIndex = currentIndex + 1;
			const nextPk = parsedPks[nextPkIndex];
			getHalftime(Number(nextPk));
		}
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

	// 키보드 인터렉션 가능하도록 포커싱
	const swiperRef = useRef<SwiperRef | null>(null);
	useEffect(() => {
		swiperRef.current.swiper.slidesEl.focus();
	}, []);

	return (
		<div
			className={clsx(
				'w-full min-h-150 overflow-scroll no-scrollbar',
				isMobileNavbar ? 'h-dvh' : 'h-[calc(100dvh-72px)]',
			)}
		>
			<Swiper
				ref={swiperRef}
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
