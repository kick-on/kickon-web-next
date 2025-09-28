'use client';

import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import CommentBottomSheet from './comment-bottom-sheet';
import { useSwiper } from 'swiper/react';
import CommentFloatingPanel from './comment-floating-panel';
import { createPortal } from 'react-dom';

export default function CommentSection({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	const isLeftSideVisible = useIsLeftSideVisible();
	const swiper = useSwiper();

	return isLeftSideVisible ? (
		<CommentFloatingPanel onClose={onClose} />
	) : (
		createPortal(
			<CommentBottomSheet swiper={swiper} isCommentBottomSheetOpen={isOpen} onClose={onClose} />,
			document.getElementById('comment-bottom-sheet-portal'),
		)
	);
}
