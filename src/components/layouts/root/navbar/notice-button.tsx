'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NoticeButton() {
	const pathname = usePathname();
	const iconSrc = pathname === '/' ? '/notice-black.svg' : '/notice-white.svg';

	// 알림이 있다고 가정
	const unreadCount = 99;

	return (
		<button className="relative w-6 h-6 @mobile:w-5 @mobile:h-5">
			<Image src={iconSrc} alt="알림 아이콘" width={24} height={24} />

			{unreadCount > 0 && (
				<span className="absolute -top-[7px] left-[9px] flex w-fit min-w-4 h-4 px-[2px] py-[3px] items-center justify-center bg-negative text-black-000 button6-semibold rounded-full">
					{unreadCount}
				</span>
			)}
		</button>
	);
}
