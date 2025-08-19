'use client';

import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import { isFullScreen } from '@/lib/utils/isFullScreen';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MarginWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isMobileNavbar = !useIsLeftSideVisible();
	const [hasMargin, setHasMargin] = useState(false);

	useEffect(() => {
		setHasMargin(isMobileNavbar && !isFullScreen(pathname));
	}, [pathname, isMobileNavbar]);

	return <div className={hasMargin ? 'mt-16' : ''}>{children}</div>;
}
