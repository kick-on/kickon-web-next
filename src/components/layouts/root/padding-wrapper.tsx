'use client';

import { isFullScreen } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function PaddingWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return <div className={isFullScreen(pathname) ? '' : 'pb-[9.375rem]'}>{children}</div>;
}
