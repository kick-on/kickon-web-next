'use client';

import { usePathname, useRouter } from 'next/navigation';
import NavButton from './nav-button';
import Image from 'next/image';
import useIsTabletWidth from '@/lib/hooks/useIsTabletWidth';
import LoginButton from './login-button';
import MobileNavbar from '../mobile-navbar';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import { Suspense } from 'react';
import { isFullScreen } from '@/lib/utils/isFullScreen';

export interface NavButton {
	href: string;
	content: string;
	isActive: boolean;
}

export default function Navbar() {
	const router = useRouter();
	const pathname = usePathname();
	const isHome = pathname === '/';

	const isDesktop = useIsDesktop();
	const isTabletWidth = useIsTabletWidth();
	const isLeftSideBarVisible = useIsLeftSideVisible();

	const navButtons: NavButton[] = [
		!isDesktop ? { href: '/', content: '홈', isActive: pathname === '/' } : null,
		{ href: '/gamble', content: '승부예측', isActive: pathname.split('/').includes('gamble') },
		{ href: '/news?q=전체', content: '뉴스', isActive: pathname.split('/').includes('news') },
		{ href: '/board?q=전체', content: '클럽 커뮤니티', isActive: pathname.split('/').includes('board') },
		!isLeftSideBarVisible || !isDesktop
			? { href: '/ranking', content: '랭킹', isActive: pathname === '/ranking' }
			: null,
	];

	const handleLogoClick = () => {
		router.push('/');
	};

	if (!isDesktop === null) return null;

	if (isFullScreen(pathname)) {
		return null;
	}

	return !isDesktop ? (
		<MobileNavbar navButtons={navButtons} />
	) : (
		<header className={`${isHome ? 'bg-black-000' : 'bg-black-800'} sticky z-30 transition-colors ease-out`}>
			<div className="flex justify-between items-center h-[4.5rem] max-w-[85rem] min-w-[48rem] max-[1094px]:w-[48rem] max-[1440px]:w-[62.5rem] m-auto">
				<nav className="flex items-center">
					<Image
						width={216}
						height={48}
						onClick={handleLogoClick}
						className="px-6 py-3 ml-[1rem] mr-[4.125rem] tablet:px-2.5 tablet:mx-0 box-content cursor-pointer"
						src={isHome ? '/logo/kick-on-black.svg' : '/logo/kick-on-white.svg'}
						alt="킥온"
					/>
					{navButtons.map((props) => props && <NavButton key={props.content} {...props} />)}
				</nav>
				{(pathname === '/signup' || isTabletWidth) && (
					<Suspense>
						<LoginButton />
					</Suspense>
				)}
			</div>
		</header>
	);
}
