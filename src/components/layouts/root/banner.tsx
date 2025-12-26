'use client';

import { usePathname } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import { BannerDto } from '@/services/apis/event-board/event-board.type';
import { useEffect, useState } from 'react';
import { getBanner } from '@/services/apis/event-board/event-board.api';
import clsx from 'clsx';
import useIsMobile from '@/lib/hooks/useIsMobile';

export default function Banner() {
	const [banners, setBanners] = useState<BannerDto[]>([]);
	const isMobile = useIsMobile();
	const pathname = usePathname();

	useEffect(() => {
		const getBanners = async () => {
			const response = await getBanner();

			if (!response) {
				setBanners([]);
			} else {
				setBanners(response.data);
			}
		};

		getBanners();
	}, []);

	const navigationButtons = [
		{
			src: '/chevron/banner-left.svg',
			className: 'left-[4.8125rem] @mobile:left-[1.625rem] desktop:left-[5.5625rem] swiper-button-prev',
			label: '왼쪽',
		},
		{
			src: '/chevron/banner-right.svg',
			className: 'right-[4.8125rem] @mobile:right-[1.625rem] desktop:right-[5.5625rem] swiper-button-next',
			label: '오른쪽',
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
				className={clsx(
					`relative w-full h-[clamp(18.6875rem,35vw,35rem)] @mobile:h-auto @mobile:aspect-[100/29] @mobile:mt-16`,
					isMobile ? 'mobile-banner-swiper' : 'banner-swiper',
				)}
			>
				{navigationButtons.map((button) => (
					<Image
						key={button.label}
						className={`absolute z-20 top-1/2 -translate-y-1/2 cursor-pointer
							opacity-30 hover:opacity-100 transition-opacity ${button.className}`}
						width={isMobile ? 14 : 27}
						height={isMobile ? 26 : 51}
						src={button.src}
						alt={''}
					/>
				))}

				{banners.map((banner) => (
					<SwiperSlide key={banner.id} className="w-full h-full">
						<Image
							onClick={() => {
								if (banner.embeddedUrl) window.open(banner.embeddedUrl, '_blank');
							}}
							className={clsx('w-full h-full object-cover', { 'cursor-pointer': banner.embeddedUrl })}
							width={1920}
							height={560}
							src={banner.thumbnailUrl}
							alt=""
						/>
					</SwiperSlide>
				))}
			</Swiper>
		);
	}

	return null;
}
