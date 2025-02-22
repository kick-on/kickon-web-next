'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
	const pathname = usePathname();
	const bgColor = pathname === '/' ? 'bg-black-000' : 'bg-black-800';

	if (pathname === '/' || pathname === '/signup') {
		return <div className={`${bgColor} h-[13.125rem]`}>푸터</div>;
	}
}
