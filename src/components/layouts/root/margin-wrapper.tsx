'use client';
import { usePathname } from 'next/navigation';

const NO_MARGIN_PAGES = ['/notice'];

export default function MarginWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const hasMargin = !NO_MARGIN_PAGES.includes(pathname);

	// useEffect(() => {
	// 	setHasMargin(isMobileNavbar && !isFullScreen(pathname));
	// }, [pathname, isMobileNavbar]);

	return <div className={hasMargin ? 'mt-16' : ''}>{children}</div>;
}
