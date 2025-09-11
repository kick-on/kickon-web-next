'use client';

import useIsDesktop from '@/lib/hooks/useIsDesktop';
import CommentFloationPanel from './comment-floating-panel';
import CommentBottomSheet from './comment-bottom-sheet';

export default function CommentSection() {
	const isDesktop = useIsDesktop();

	return isDesktop ? <CommentFloationPanel /> : <CommentBottomSheet />;
}
