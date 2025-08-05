'use client';

import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { isFullScreen } from '@/lib/utils/isFullScreen';
import { usePathname } from 'next/navigation';

export default function MarginWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isMobileNavbar = !useIsLeftSideVisible();
	const hasMargin = () => {
		if (isMobileNavbar && !isFullScreen(pathname)) return true;
		if (isMobileNavbar && isFullScreen(pathname)) return false;
		if (!isMobileNavbar) return false;
	};

	return <div className={hasMargin() ? 'mt-16' : ''}>{children}</div>;
}
