'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

export default function Footer() {
	const [isMobile, setIsMobile] = useState<boolean | null>(null);
	const pathname = usePathname();

	useEffect(() => {
		const device = UAParser().device;
		setIsMobile(device.type === 'mobile');
	}, []);

	if (pathname === '/' || pathname === '/signup') {
		const isHome = pathname === '/';
		const bgColor = isHome ? 'bg-black-000' : 'bg-black-800';
		const textColor = isHome ? 'text-black-700' : 'text-black-200';
		const src = isHome ? '/logo/without-icon-black.svg' : '/logo/without-icon-white.svg';

		return (
			<div className={`${bgColor} h-[13.125rem] flex items-center`}>
				<div
					className={`${textColor} flex items-start button4-medium max-w-[85rem]
						gap-[3.625rem] mx-auto @mobile:flex-col @mobile:gap-6 @mobile:pl-6`}
				>
					<Image width={140} height={22} src={src} alt="킥온" />

					<div className="flex flex-col gap-4">
						<div className="flex gap-4">
							<span
								className="cursor-pointer"
								onClick={() => {
									if (window) {
										window.open('https://www.notion.so/devbob/1c3e7fdb8ed1803798c4cd8fc15b13d7', '_blank');
									}
								}}
							>
								서비스 이용약관
							</span>
							|
							<span
								className="cursor-pointer"
								onClick={() => {
									if (typeof window !== 'undefined') {
										window.open('https://www.notion.so/devbob/1c3e7fdb8ed180f39725d9aa9a6f1011', '_blank');
									}
								}}
							>
								개인정보처리방침
							</span>
						</div>

						<div className="flex gap-4 tablet:flex-col">
							<span>
								Copyright 2025. Kick-on {isMobile && <br />}All pictures cannot be copied {isMobile && <br />}without
								permission
							</span>
							<span>E-mail: business.kickon@gmail.com</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
