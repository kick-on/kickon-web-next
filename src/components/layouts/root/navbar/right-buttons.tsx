'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import NoticeButton from './notice-button';
import LoginButton from './login-button';
import clsx from 'clsx';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

interface RightButtonsProps {
	isMobile?: boolean;
	isTabletWidth?: boolean;
	onClickProfile?: () => void;
}

export default function RightButtons({ isMobile = false, isTabletWidth = false, onClickProfile }: RightButtonsProps) {
	const pathname = usePathname();
	const { currentUserInfo } = useCurrentUserInfoStore();

	return (
		<div
			className={clsx(
				'h-[2.375rem] grid grid-cols-[auto_auto] items-center justify-center',
				isMobile ? ' gap-[18px] ml-auto' : 'gap-6',
			)}
		>
			{currentUserInfo && <NoticeButton />}
			<Suspense>
				{isMobile ? (
					<LoginButton onClickProfile={onClickProfile} />
				) : (
					(pathname === '/signup' || isTabletWidth) && <LoginButton />
				)}
			</Suspense>
		</div>
	);
}
