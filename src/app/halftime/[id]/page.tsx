'use client';

import Player from '@/components/features/halftime/player';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { useViewedHalftimesStore } from '@/lib/store/useHalftimeStore';
import { createBoardView } from '@/services/apis/board/board-view-history.api';
import { createNewsView } from '@/services/apis/news/news-view-history.api';
import { getHalftimeDetail } from '@/services/apis/shorts/shorts.api';
import clsx from 'clsx';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { shouldUpdateView } from '@/lib/utils';
import { HalftimeSortType } from '@/services/apis/shorts/shorts.type';

export default function Page() {
	const {
		_hasHydrated: isHalftimesLoaded,
		viewedHalftimes,
		appendViewedHalftime,
		clearViewedHalftimes,
	} = useViewedHalftimesStore();

	const params = useParams();
	const searchParams = useSearchParams();
	const { id: pk } = params;
	const sort = searchParams.get('sort') as HalftimeSortType;

	const getHalftime = async (pkToFetch: number) => {
		// 이미 조회한 하프타임인 경우 return
		if (viewedHalftimes.find((h) => h.pk === pkToFetch)) return;

		try {
			const response = await getHalftimeDetail(pkToFetch, sort);

			if (viewedHalftimes.length > 0 || !response.data.nextPk) {
				// 스크롤에 따라 다음 하프타임만 추가하거나,
				// 다음 하프타임이 없어 현재 하프타임 하나만 추가하는 경우
				appendViewedHalftime(response.data);
			} else {
				// 현재 + 다음 하프타임을 추가하는 경우
				const nextHalftimeResponse = await getHalftimeDetail(response.data.nextPk, sort);
				appendViewedHalftime(response.data, nextHalftimeResponse.data);
			}
		} catch {
			alert('동영상을 불러오는 중 문제가 발생했습니다.');
		}
	};

	const createView = (pk: number) => {
		if (!shouldUpdateView('viewedHalftimes', pk)) return;

		const currentHalftime = viewedHalftimes.find((h) => h.pk === pk);
		if (!currentHalftime) return;

		const isNews = currentHalftime.usedIn === 'NEWS';
		const refrencePk = currentHalftime.referencePk;

		if (isNews) {
			createNewsView(refrencePk);
		} else {
			createBoardView(refrencePk);
		}
	};

	// 초기 렌더링 시 halftime fetch
	const swiperRef = useRef<SwiperRef>(null);

	useEffect(() => {
		if (!pk || !isHalftimesLoaded || !swiperRef.current) return;

		const pkNum = Number(pk);
		const currentIndex = viewedHalftimes.findIndex((h) => h.pk === pkNum);

		// 경로, params, active slide 일치시키기
		window.history.replaceState(null, '', `/halftime/${pkNum}${sort ? `?sort=${sort}` : ''}`);
		swiperRef.current.swiper.slideTo(currentIndex === -1 ? 0 : currentIndex, 0);

		getHalftime(pkNum);
		createView(pkNum);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isHalftimesLoaded]);

	useEffect(() => {
		return () => {
			clearViewedHalftimes();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSlideChange = (swiper: SwiperType) => {
		const { activeIndex } = swiper;
		if (!viewedHalftimes[activeIndex]) return;

		// useRouter 사용에 따른 재렌더링 방지
		window.history.replaceState(null, '', `/halftime/${viewedHalftimes[activeIndex].pk}${sort ? `?sort=${sort}` : ''}`);

		const currentPk = viewedHalftimes[activeIndex].pk;
		createView(currentPk);

		const nextPk = viewedHalftimes[activeIndex].nextPk;
		if (nextPk) {
			getHalftime(nextPk);
		}
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
				ref={swiperRef}
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
				{viewedHalftimes.map((halftime, i) => (
					<SwiperSlide key={halftime?.pk ?? `error-${i}`} className="desktop:px-22 w-full">
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
