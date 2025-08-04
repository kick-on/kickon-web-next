'use client';

import Player from '@/components/features/halftime/player';
import { Keyboard, Mousewheel } from 'swiper/modules';
import { SwiperSlide, Swiper } from 'swiper/react';

export default function Page() {
	return (
		<div className="w-full h-[calc(100dvh-72px)] @mobile:h-dvh overflow-scroll no-scrollbar">
			<Swiper
				loop
				className="w-fit @mobile:w-full h-full"
				direction="vertical"
				slidesPerView={1.2}
				spaceBetween={24}
				centeredSlides
				modules={[Mousewheel, Keyboard]}
				mousewheel={{
					enabled: true,
					releaseOnEdges: true,
					forceToAxis: true,
					thresholdDelta: 15,
					sensitivity: 1,
				}}
				keyboard={{
					enabled: true,
					onlyInViewport: true,
				}}
			>
				{[1, 2, 3, 4].map((i) => (
					<SwiperSlide
						key={i}
						className="bg-black-300 w-auto h-full aspect-[2/3] @mobile:h-auto @mobile:w-full rounded-lg overflow-hidden"
					>
						{({ isActive }) =>
							i === 1 ? (
								<Player index={i} autoplay={isActive} src="/video/test1.mp4" />
							) : i === 2 ? (
								<Player index={i} autoplay={isActive} src="/video/test2.mp4" />
							) : i === 3 ? (
								<Player index={i} autoplay={isActive} src="https://www.youtube.com/watch?v=-NMmHBIijKg" />
							) : (
								<Player index={i} autoplay={isActive} src="https://www.youtube.com/shorts/KrMk5Ew-Vus" />
							)
						}
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
