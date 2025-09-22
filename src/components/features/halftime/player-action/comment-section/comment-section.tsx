'use client';

import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import CommentBottomSheet from './comment-bottom-sheet';
import { useSwiper } from 'swiper/react';
import CommentFloatingPanel from './comment-floating-panel';
import { createPortal } from 'react-dom';

export default function CommentSection({ onClose }: { onClose: () => void }) {
	const isLeftSideVisible = useIsLeftSideVisible();
	const swiper = useSwiper();

	return isLeftSideVisible ? (
		<CommentFloatingPanel onClose={onClose} />
	) : (
		createPortal(
			<CommentBottomSheet swiper={swiper} onClose={onClose} />,
			document.getElementById('comment-bottom-sheet-portal'),
		)
	);
}
