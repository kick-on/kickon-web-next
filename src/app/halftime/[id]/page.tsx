'use client';

import Player from '@/components/features/halftime/player';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { useAllHalftimePksStore, useViewedHalftimesStore } from '@/lib/store/useHalftimeStore';
import { createBoardView } from '@/services/apis/board/board-view-history.api';
import { createNewsView } from '@/services/apis/news/news-view-history.api';
import { getHalftimeDetail, getHalftimeList } from '@/services/apis/shorts/shorts.api';
import { GetHalftimeListRequest } from '@/services/apis/shorts/shorts.type';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import shouldUpdateView from '@/lib/utils/boolean/shouldUpdateView';
import { useFetchSize } from '@/lib/hooks/useFetchSize';

export default function Page() {
	const {
		_hasHydrated: isPksLoaded,
		hasNext,
		nextParams,
		allHalftimePks,
		appendAllHalftimePks,
		clearAllHalftimePks,
	} = useAllHalftimePksStore();
	const {
		_hasHydrated: isHalftimesLoaded,
		viewedHalftimes,
		appendViewedHalftime,
		clearViewedHalftimes,
	} = useViewedHalftimesStore();

	const params = useParams();
	const { id: pk } = params;

	const getHalftime = async (pkToFetch: number) => {
		// 이미 조회한 하프타임인 경우 return
		if (viewedHalftimes.find((h) => h.pk === pkToFetch)) return;

		try {
			const response = await getHalftimeDetail(pkToFetch);
			appendViewedHalftime(response.data);
		} catch {
			alert('동영상을 불러오는 중 문제가 발생했습니다.');
		}
	};

	const getPkList = async (userParams?: GetHalftimeListRequest, pkToPrepend?: number) => {
		if (!userParams && (!hasNext || !nextParams)) return;

		const params = userParams ?? nextParams;
		let pk = pkToPrepend;

		try {
			const response = await getHalftimeList(params);
			if (response.data.find((d) => d.pk === pkToPrepend)) {
				pk = undefined;
			}
			appendAllHalftimePks({ ...params, page: params.page + 1 }, response, pk);
		} catch {
			return;
		}
	};

	const createView = (pk: number) => {
		if (!shouldUpdateView(pk)) return;

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

	const shouldFetchNext = (index: number) => {
		// 마지막 영상인 경우 다음 동영상 fetch하지 않음
		const isLastVideo = index === allHalftimePks.length - 1;
		if (isLastVideo) return false;

		// 마지막 영상이 되기 전에 pk list fetch
		const shouldFetchPks = index === allHalftimePks.length - 2;
		if (shouldFetchPks) getPkList();

		return true;
	};

	const getNextHalftime = (currentPk: number) => {
		const currentIndex = allHalftimePks.findIndex((p: number) => p === currentPk);
		if (!shouldFetchNext(currentIndex)) return;

		const nextPkIndex = currentIndex + 1;
		const nextPk = allHalftimePks[nextPkIndex];

		getHalftime(nextPk);
	};

	const swiperRef = useRef<SwiperRef>(null);
	const size = useFetchSize();

	// 초기 렌더링 시 halftime fetch
	useEffect(() => {
		if (!pk || !isPksLoaded || !isHalftimesLoaded || !swiperRef.current) return;
		const pkNum = Number(pk);
		const currentIndex = viewedHalftimes.findIndex((h) => h.pk === pkNum);
		window.history.replaceState(null, '', `/halftime/${pkNum}`);
		swiperRef.current.swiper.slideTo(currentIndex === -1 ? 0 : currentIndex, 0);

		// pk 배열이 빈 경우 (공유된 링크로 접근 등)
		// store 변경 비동기 이슈로 제대로 동작하지 않음
		if (allHalftimePks.length === 0) {
			getPkList({ sort: 'CREATED_DESC', size, page: 1 }, pkNum).then(() => {
				getHalftime(pkNum).then(() => {
					getNextHalftime(pkNum);
				});
			});
		} else {
			getHalftime(pkNum).then(() => {
				getNextHalftime(pkNum);
			});
		}
		createView(pkNum);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPksLoaded, isHalftimesLoaded]);

	useEffect(() => {
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
		createView(currentPk);
		getNextHalftime(currentPk);
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
