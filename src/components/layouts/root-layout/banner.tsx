'use client';

import { usePathname } from 'next/navigation';

export default function Banner() {
	const pathname = usePathname();

	if (pathname === '/') {
		return <div className="bg-black-500 h-[35rem]"></div>;
	}
}
