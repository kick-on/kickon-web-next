'use client';

import useIsDesktop from '@/lib/hooks/useIsDesktop';
import { usePathname } from 'next/navigation';

export default function MarginWrapper({ children }: { children: React.ReactNode }) {
	const isDesktop = useIsDesktop();
	const pathname = usePathname();

	return <div className={isDesktop || pathname === '/notice' ? '' : 'mt-16'}>{children}</div>;
}
