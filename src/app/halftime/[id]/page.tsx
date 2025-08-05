'use client';

import Player from '@/components/features/halftime/player';
import { useState } from 'react';
import { Keyboard, Mousewheel } from 'swiper/modules';
import { SwiperSlide, Swiper } from 'swiper/react';

export default function Page() {
	const [gobalMute, setGlobalMute] = useState(true);

	const toggleGlobalMute = () => {
		setGlobalMute((prev) => !prev);
	};

	return (
		<div className="w-full h-dvh min-h-150 overflow-scroll no-scrollbar">
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
					<SwiperSlide key={i} className="desktop:px-22">
						{({ isActive }) => (
							<div className="w-auto h-full aspect-[14/25] @mobile:h-full @mobile:w-full @mobile:aspect-auto rounded-lg bg-black-300">
								<Player
									isCurrentPlayer={isActive}
									src={
										i === 1
											? '/video/test1.mp4'
											: i === 2
												? '/video/test2.mp4'
												: i === 3
													? 'https://www.youtube.com/watch?v=-NMmHBIijKg'
													: 'https://www.youtube.com/shorts/KrMk5Ew-Vus'
									}
									globalMuted={gobalMute}
									toggleGlobalMuted={toggleGlobalMute}
								/>
							</div>
						)}
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
