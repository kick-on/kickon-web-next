'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import NoticeButton from './notice-button';
import LoginButton from './login-button';
import clsx from 'clsx';

interface RightButtonsProps {
	isMobile?: boolean;
	isTabletWidth?: boolean;
	onClickProfile?: () => void;
}

export default function RightButton({ isMobile = false, isTabletWidth = false, onClickProfile }: RightButtonsProps) {
	const pathname = usePathname();

	return (
		<div className={clsx('flex items-center justify-center', isMobile ? ' gap-[18px] ml-auto' : 'gap-6')}>
			<NoticeButton />
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
