'use client';

import { usePathname } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

export default function Banner() {
	const pathname = usePathname();

	const navigationButtons = [
		{
			src: '/chevron/banner-left.svg',
			className: 'left-[5.5625rem] swiper-button-prev',
			alt: '왼쪽',
		},
		{
			src: '/chevron/banner-right.svg',
			className: 'right-[5.5625rem] swiper-button-next',
			alt: '오른쪽',
		},
	];

	if (pathname === '/') {
		return (
			<Swiper
				modules={[Navigation, Pagination]}
				slidesPerView={1}
				navigation={{
					prevEl: '.swiper-button-prev',
					nextEl: '.swiper-button-next',
				}}
				pagination={{
					clickable: true,
				}}
				loop
				className={`relative w-full h-[35rem] banner-swiper`}
			>
				{navigationButtons.map((button) => (
					<Image
						key={button.alt}
						className={`absolute z-20 top-1/2 -translate-y-1/2
							opacity-30 hover:opacity-100 transition-opacity ${button.className}`}
						width={30}
						height={56}
						src={button.src}
						alt={button.alt}
					/>
				))}

				{[0, 1, 2].map((i) => (
					<SwiperSlide key={i} className="w-full h-full">
						<Image
							className="w-full h-full object-cover"
							width={1920}
							height={560}
							src={`/banner/${i}.svg`}
							alt="배너 이미지"
						/>
					</SwiperSlide>
				))}
			</Swiper>
		);
	}

	return null;
}
