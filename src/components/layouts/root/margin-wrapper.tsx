'use client';

import useIsDesktop from '@/lib/hooks/useIsDesktop';
import { isFullScreen } from '@/lib/utils/isFullScreen';
import { usePathname } from 'next/navigation';

export default function MarginWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isDesktop = useIsDesktop();

	return <div className={isDesktop || isFullScreen(pathname) ? '' : 'mt-16'}>{children}</div>;
}
