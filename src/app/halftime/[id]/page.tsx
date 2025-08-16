'use client';

import Player from '@/components/features/halftime/player';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { useHalftimes } from '@/lib/store/useHalftimeStore';
import { getHalftimeDetail } from '@/services/apis/shorts/shorts.api';
import { GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Page() {
	const { halftimes, pushHalftimes, clearHalftimes } = useHalftimes();

	const params = useParams();
	const { id: pk } = params;

	const getHalftime = async (pkToFetch: number) => {
		try {
			const response = await getHalftimeDetail(pkToFetch);
			pushHalftimes(response.data);
		} catch {
			alert('동영상을 불러오는 중 문제가 발생했습니다.');
		}
	};

	// 초기 렌더링 시 halftime fetch
	useEffect(() => {
		if (!pk) return;
		getHalftime(Number(pk));

		const storedPks: number[] = JSON.parse(sessionStorage.getItem('KICKON_HALFTIME_PKS') || '[]');
		const currentIndex = storedPks.findIndex((p: number) => p === Number(pk));
		const isLastVideo = currentIndex === storedPks.length - 1;

		if (isLastVideo) return;

		const nextPkIndex = currentIndex + 1;
		const nextPk = storedPks[nextPkIndex];
		getHalftime(nextPk);

		// 언마운트 시 전역 halftimes clear
		return () => {
			clearHalftimes();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSlideChange = (swiper: SwiperType) => {
		const { activeIndex } = swiper;
		if (!halftimes[activeIndex]) return;

		// useRouter 사용에 따른 재렌더링 방지
		window.history.replaceState(null, '', `/halftime/${halftimes[activeIndex].pk}`);

		const storedPks: number[] = JSON.parse(sessionStorage.getItem('KICKON_HALFTIME_PKS') || '[]');
		const currentPk = halftimes[activeIndex].pk;
		const currentIndexInFullList = storedPks.findIndex((p) => p === currentPk);
		const isLastVideo = currentIndexInFullList === storedPks.length - 1;

		if (isLastVideo) return;

		const nextPkIndex = currentIndexInFullList + 1;
		const nextPk = storedPks[nextPkIndex];
		const isSeen = halftimes.some((h: GetHalftimeDetailDto) => h.pk === nextPk);

		if (isSeen) return;

		getHalftime(nextPk);
	};

	const [globalMuted, setGlobalMuted] = useState(true);

	const toggleGlobalMuted = () => {
		setGlobalMuted((prev) => !prev);
	};

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
				onSlideChange={handleSlideChange}
				modules={[Keyboard]}
				keyboard={{ enabled: true }}
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
