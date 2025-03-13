'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
	const pathname = usePathname();
	const isHome = pathname === '/';
	const bgColor = isHome ? 'bg-black-000' : 'bg-black-800';
	const textColor = isHome ? 'text-black-700' : 'text-black-200';
	const src = isHome ? '/logo/without-icon-black.svg' : '/logo/without-icon-white.svg';

	if (pathname === '/' || pathname === '/signup') {
		return (
			<div className={`${bgColor} h-[13.125rem] pl-[17.5rem] flex items-center`}>
				<div className={`${textColor} flex items-start gap-[3.625rem] button4-medium`}>
					<Image width={140} height={22} src={src} alt="킥온" />

					<div className="flex flex-col gap-4">
						<div className="flex gap-4">
							<span className="cursor-pointer">서비스 이용약관</span>|
							<span className="cursor-pointer">개인정보처리방침</span>
						</div>

						<div className="flex gap-4">
							<span>Copyright 2025. Kick-on All pictures cannot be copied without permission</span>
							<span>E-mail: business.kickon@gmail.com</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
