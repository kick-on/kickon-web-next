'use client';

import { useEffect, useState } from 'react';
import CommentContent from './comment-content';
import useIsMobile from '@/lib/hooks/useIsMobile';
import clsx from 'clsx';
import Swiper from 'swiper';

type BottomSheetState = 'FULL' | 'HALF' | 'CLOSE';

export default function CommentBottomSheet({
	swiper,
	isCommentBottomSheetOpen,
	onClose,
}: {
	swiper: Swiper;
	isCommentBottomSheetOpen: boolean;
	onClose: () => void;
}) {
	const isMobile = useIsMobile();
	const [width, setWidth] = useState(0);

	// 스와이퍼 width에 맞게 바텀시트 width 조정
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

	// 바텀시트 애니메이션
	const [sheetState, setSheetState] = useState<BottomSheetState>('CLOSE');
	const [startY, setStartY] = useState<number | null>(null);

	useEffect(() => {
		if (isCommentBottomSheetOpen) {
			setSheetState('HALF');
		}
	}, [isCommentBottomSheetOpen]);

	const threshold = 20;

	const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
		e.stopPropagation();

		const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
		setStartY(y);
	};

	const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
		e.stopPropagation();

		if (startY === null) return;
		const y = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
		const deltaY = y - startY; // 위로 드래그하면 음수, 아래로 드래그하면 양수

		if (sheetState === 'HALF') {
			if (deltaY < -threshold) setSheetState('FULL');
			else if (deltaY > threshold) handleBottomSheetClose();
		} else if (sheetState === 'FULL') {
			if (deltaY > threshold) setSheetState('HALF');
		}

		setStartY(null);
	};

	const handleBottomSheetClose = () => {
		setSheetState('CLOSE');
		setTimeout(() => {
			onClose();
			setSheetState('HALF');
		}, 200);
	};

	return (
		<div className="fixed top-0 left-0 min-w-3xl w-dvw h-dvh z-25">
			<div
				className={clsx(
					'absolute h-full w-full bottom-0 bg-black-000 rounded-t-[0.625rem] @mobile:w-dvw! transition-[max-height]',
					isMobile ? 'w-dvw!' : 'left-1/2 -translate-x-1/2',
					{
						'max-h-dvh': sheetState === 'FULL',
						'max-h-3/5': sheetState === 'HALF',
						'max-h-0': sheetState === 'CLOSE',
					},
				)}
				style={{ width }}
			>
				<div className="absolute w-[3.125rem] h-1 rounded-full bg-black-300 top-1.5 left-1/2 -translate-x-1/2 z-5" />
				<CommentContent onClose={handleBottomSheetClose} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
			</div>
		</div>
	);
}
