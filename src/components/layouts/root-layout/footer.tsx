'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
	const pathname = usePathname();

	if (pathname === '/' || pathname === '/signup') {
		return <footer className="h-[28.5rem] bg-black-300">푸터</footer>;
	}
}
