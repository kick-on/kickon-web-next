'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
	const pathname = usePathname();

	// notice 페이지에서는 Navbar 숨김
	if (pathname.startsWith('/notice')) return null;

	return <Navbar />;
}
