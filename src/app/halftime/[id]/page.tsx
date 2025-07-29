'use client';

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
					></SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
