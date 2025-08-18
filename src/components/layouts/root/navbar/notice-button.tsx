'use client';

import useIsMobile from '@/lib/hooks/useIsMobile';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import NoticeModal from './notice-modal';
import { useNotificationStore } from '@/lib/store/useNotificationStore';
import clsx from 'clsx';
import useIsTabletWidth from '@/lib/hooks/useIsTabletWidth';
import useIsDesktop from '@/lib/hooks/useIsDesktop';

export default function NoticeButton() {
	const pathname = usePathname();
	const router = useRouter();
	const isMobile = useIsMobile();
	const isTabletWidth = useIsTabletWidth();
	const isDesktop = useIsDesktop();
	const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

	const handleNoticeIconClick = () => {
		if (isMobile) {
			router.push('/notice');
		} else {
			setIsNoticeModalOpen((prev) => !prev);
		}
	};

	const iconSrc = pathname === '/' ? '/notice/black.svg' : '/notice/white.svg';

	const unreadCount = useNotificationStore((s) => s.unreadCount);

	return (
		<div
			className={clsx('relative w-fit h-full items-center flex', isDesktop && !isTabletWidth ? 'ml-[374px]' : 'ml-0')}
		>
			<button onClick={handleNoticeIconClick} className="relative w-6 h-6 @mobile:w-5 @mobile:h-5">
				<Image src={iconSrc} alt="알림 아이콘" width={24} height={24} />

				{unreadCount > 0 && (
					<span className="absolute -top-[7px] left-[9px] flex w-fit min-w-4 h-4 px-[2px] py-[3px] items-center justify-center bg-negative text-black-000 button6-semibold rounded-full">
						{unreadCount}
					</span>
				)}
			</button>
			{!isMobile && isNoticeModalOpen && <NoticeModal onCloseModal={() => setIsNoticeModalOpen(false)} />}
		</div>
	);
}
