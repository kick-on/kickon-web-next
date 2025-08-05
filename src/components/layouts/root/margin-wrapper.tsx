'use client';

import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { isFullScreen } from '@/lib/utils/isFullScreen';
import { usePathname } from 'next/navigation';

export default function MarginWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isMobileNavbar = !useIsLeftSideVisible();

	return <div className={isMobileNavbar && !isFullScreen(pathname) ? 'mt-16' : ''}>{children}</div>;
}
