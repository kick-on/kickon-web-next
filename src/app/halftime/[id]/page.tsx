'use client';

import Player from '@/components/features/halftime/player';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { useHalftimes } from '@/lib/store/useHalftimeStore';
import { getHalftimeDetail } from '@/services/apis/shorts/shorts.api';
import { GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

export default function Page() {
	const { halftimes, pushHalftimes, clearHalftimes } = useHalftimes();

	const params = useParams();
	const { id: pk } = params;

	const getHalftime = useCallback(
		async (pkToFetch: number) => {
			if (halftimes.some((h: GetHalftimeDetailDto) => h.pk === pkToFetch)) {
				return;
			}
			try {
				const response = await getHalftimeDetail(pkToFetch);
				pushHalftimes(response.data);
			} catch {
				alert('동영상을 불러오는 중 문제가 발생했습니다.');
			}
		},
		[halftimes, pushHalftimes],
	);

	useEffect(() => {
		const storedPks = sessionStorage.getItem('KICKON_HALFTIME_PKS');
		if (!storedPks || typeof pk !== 'string') return;
		const parsedPks = JSON.parse(storedPks);

		getHalftime(Number(pk));

		const currentIndex = parsedPks.findIndex((parsedPk: string) => parsedPk == pk);
		const isLastVideo = currentIndex === parsedPks.length - 1;

		if (!isLastVideo) {
			const nextPkIndex = currentIndex + 1;
			const nextPk = parsedPks[nextPkIndex];
			getHalftime(Number(nextPk));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSlideChange = (swiper: SwiperClass) => {
		const { activeIndex } = swiper;
		if (!halftimes[activeIndex]) return;

		window.history.replaceState(null, '', `/halftime/${halftimes[activeIndex].pk}`);

		const storedPks = JSON.parse(sessionStorage.getItem('KICKON_HALFTIME_PKS') || '[]');
		const currentPk = halftimes[activeIndex].pk;
		const currentIndexInFullList = storedPks.findIndex((p: string) => Number(p) == currentPk);
		const isLastVideo = currentIndexInFullList === storedPks.length - 1;

		if (!isLastVideo) {
			const nextPkIndex = currentIndexInFullList + 1;
			const nextPk = storedPks[nextPkIndex];
			getHalftime(Number(nextPk));
		}
	};

	const initialSlideIndex = useMemo(() => {
		if (typeof pk !== 'string') return 0;
		const index = halftimes.findIndex((h) => h.pk === Number(pk));
		return index > -1 ? index : 0;
	}, [pk, halftimes]);

	const [globalMuted, setGlobalMuted] = useState(true);

	const toggleGlobalMuted = () => {
		setGlobalMuted((prev) => !prev);
	};

	const [isMobileNavbar, setIsMobileNavber] = useState(false);
	const isLeftSideVisible = !useIsLeftSideVisible();

	useEffect(() => {
		setIsMobileNavber(isLeftSideVisible);
	}, [isLeftSideVisible]);

	// 키보드 인터렉션 가능하도록 포커싱
	const swiperRef = useRef<SwiperRef | null>(null);
	useEffect(() => {
		if (swiperRef.current) {
			swiperRef.current.swiper.slidesEl.focus();
		}

		// 페이지 이동 시 기존 halftime 리스트 제거
		return () => {
			clearHalftimes();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				initialSlide={initialSlideIndex}
				onSlideChange={handleSlideChange}
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
