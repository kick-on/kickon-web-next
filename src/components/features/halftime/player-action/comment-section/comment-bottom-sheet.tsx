'use client';

import { useEffect, useState } from 'react';
import CommentContent from './comment-content';
import useIsMobile from '@/lib/hooks/useIsMobile';
import clsx from 'clsx';
import Swiper from 'swiper';

export default function CommentBottomSheet({ swiper, onClose }: { swiper: Swiper; onClose: () => void }) {
	const isMobile = useIsMobile();
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const handleResize = () => {
			if (swiper) {
				setWidth(swiper.slides[0]?.children[0]?.clientWidth);
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [swiper]);

	return (
		<div className="fixed top-0 left-0 min-w-3xl w-dvw h-dvh z-25">
			<div
				className={clsx(
					'absolute max-h-3/5 h-full bottom-0 bg-black-000 rounded-t-[0.625rem] @mobile:w-dvw!',
					isMobile ? 'w-dvw!' : 'left-1/2 -translate-x-1/2',
				)}
				style={{ width }}
			>
				<div className="absolute w-[3.125rem] h-1 rounded-full bg-black-300 top-1.5 left-1/2 -translate-x-1/2 z-5" />
				<CommentContent onClose={onClose} />
			</div>
		</div>
	);
}
