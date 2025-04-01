'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import { BannerDto } from '@/services/apis/event-board/dto';
import { useEffect, useState } from 'react';
import { getBanner } from '@/services/apis/event-board';
import clsx from 'clsx';

export default function Banner() {
	const router = useRouter();
	const pathname = usePathname();
	const [banners, setBanners] = useState<BannerDto[]>([]);

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
						className={`absolute z-20 top-1/2 -translate-y-1/2 cursor-pointer
							opacity-30 hover:opacity-100 transition-opacity ${button.className}`}
						width={30}
						height={56}
						src={button.src}
						alt={button.alt}
					/>
				))}

				{banners.map((banner) => (
					<SwiperSlide key={banner.id} className="w-full h-full">
						<Image
							onClick={() => {
								if (banner.embeddedUrl) router.push(banner.embeddedUrl);
							}}
							className={clsx('w-full h-full object-cover', { 'cursor-pointer': banner.embeddedUrl })}
							width={1920}
							height={560}
							title={banner.title}
							src={banner.thumbnailUrl}
							alt="배너 이미지"
						/>
					</SwiperSlide>
				))}
			</Swiper>
		);
	}

	return null;
}
