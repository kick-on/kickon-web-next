'use client';

import useIsDesktop from '@/lib/hooks/useIsDesktop';

export default function MarginWrapper({ children }: { children: React.ReactNode }) {
	const isDesktop = useIsDesktop();

	return <div className={isDesktop ? '' : 'mt-16'}>{children}</div>;
}
