'use client';

import { RefObject, useEffect, useState } from 'react';
import { SwiperRef } from 'swiper/react';
import CommentContent from './comment-content';

export default function CommentBottomSheet({ swiperRef }: { swiperRef: RefObject<SwiperRef> }) {
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const handleResize = () => {
			if (swiperRef.current) {
				const swiper = swiperRef.current.swiper;
				setWidth(swiper.slides[0]?.children[0]?.clientWidth);
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [swiperRef]);

	return (
		<div className="fixed top-0 left-0 min-w-3xl w-dvw h-dvh z-20">
			<div
				className="absolute max-h-3/5 bottom-0 left-1/2 -translate-x-1/2 bg-black-000 rounded-t-[0.625rem]"
				style={{ width }}
			>
				<div className="absolute w-[3.125rem] h-1 rounded-full bg-black-300 top-1.5 left-1/2 -translate-x-1/2 z-5"></div>
				<CommentContent />
			</div>
		</div>
	);
}
