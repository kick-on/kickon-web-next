'use client';

import Player from '@/components/features/halftime/player';
import useHalftimeView from '@/lib/utils/boolean/shouldUpdateView';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { useAllHalftimePksStore, useViewedHalftimesStore } from '@/lib/store/useHalftimeStore';
import { createBoardView } from '@/services/apis/board/board-view-history.api';
import { createNewsView } from '@/services/apis/news/news-view-history.api';
import { getHalftimeDetail, getHalftimeList } from '@/services/apis/shorts/shorts.api';
import { GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import shouldUpdateView from '@/lib/utils/boolean/shouldUpdateView';

export default function Page() {
	const { hasNext, nextParams, allHalftimePks, appendAllHalftimePks, clearAllHalftimePks } = useAllHalftimePksStore();
	const { viewedHalftimes, appendViewedHalftime, clearViewedHalftimes } = useViewedHalftimesStore();

	const params = useParams();
	const { id: pk } = params;

	const getHalftime = async (pkToFetch: number) => {
		try {
			const response = await getHalftimeDetail(pkToFetch);
			appendViewedHalftime(response.data);
		} catch {
			alert('동영상을 불러오는 중 문제가 발생했습니다.');
		}
	};

	const getPkList = async () => {
		if (!hasNext || !nextParams) return;

		try {
			const response = await getHalftimeList(nextParams);
			appendAllHalftimePks({ ...nextParams, page: nextParams.page + 1 }, response);
		} catch {
			return;
		}
	};

	const createView = (pk: number) => {
		if (!shouldUpdateView(pk)) return;

		const currentHalftime = viewedHalftimes.find((h) => h.pk === pk);
		const isNews = currentHalftime.usedIn === 'NEWS';
		const refrencePk = currentHalftime.referencePk;

		if (isNews) {
			createNewsView(refrencePk);
		} else {
			createBoardView(refrencePk);
		}
	};

	// 초기 렌더링 시 halftime fetch
	useEffect(() => {
		if (!pk) return;
		const pkNum = Number(pk);
		getHalftime(pkNum);
		createView(pkNum);

		const currentIndex = allHalftimePks.findIndex((p: number) => p === pkNum);
		const isLastVideo = currentIndex === allHalftimePks.length - 1;

		if (isLastVideo) return;

		const nextPkIndex = currentIndex + 1;
		const nextPk = allHalftimePks[nextPkIndex];
		getHalftime(nextPk);

		// 언마운트 시 전역 halftimes clear
		return () => {
			clearAllHalftimePks();
			clearViewedHalftimes();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSlideChange = (swiper: SwiperType) => {
		const { activeIndex } = swiper;
		if (!viewedHalftimes[activeIndex]) return;

		// useRouter 사용에 따른 재렌더링 방지
		window.history.replaceState(null, '', `/halftime/${viewedHalftimes[activeIndex].pk}`);

		const currentPk = viewedHalftimes[activeIndex].pk;
		const currentIndexInFullList = allHalftimePks.findIndex((p) => p === currentPk);
		createView(currentPk);

		const isLastVideo = currentIndexInFullList === allHalftimePks.length - 1;
		if (isLastVideo) return;

		// last video 전에 pk 추가 fetch
		const shouldFetchPks = currentIndexInFullList === allHalftimePks.length - 2;
		if (shouldFetchPks) getPkList();

		const nextPkIndex = currentIndexInFullList + 1;
		const nextPk = allHalftimePks[nextPkIndex];
		const isSeen = viewedHalftimes.some((h: GetHalftimeDetailDto) => h.pk === nextPk);

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
				{viewedHalftimes.map((halftime) => (
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
