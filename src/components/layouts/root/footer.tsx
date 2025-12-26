'use client';

import useIsMobile from '@/lib/hooks/useIsMobile';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
	const pathname = usePathname();
	const isMobile = useIsMobile();

	if (pathname === '/' || pathname === '/signup') {
		const isHome = pathname === '/';
		const bgColor = isHome ? 'bg-black-000' : 'bg-black-800';
		const textColor = isHome ? 'text-black-700' : 'text-black-200';
		const src = isHome ? '/logo/without-icon-fill-white.svg' : '/logo/without-icon-white.svg';

		return (
			<div className={`${bgColor} h-[13.125rem] flex items-center`}>
				<div
					className={`${textColor} flex items-start max-w-[85rem]
						gap-[3.625rem] mx-auto @mobile:flex-col @mobile:gap-6 @mobile:pl-6 @mobile:ml-0`}
				>
					<Image width={140} height={22} src={src} alt="" />

					<div className="flex flex-col gap-4">
						<div className="flex gap-4 button4-medium">
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

						<div className="flex gap-2.5 tablet:flex-col body5-regular @mobile:text-13 @mobile:leading-5">
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
