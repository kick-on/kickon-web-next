'use client';

import { usePathname, useRouter } from 'next/navigation';
import NavButton, { NavButtonProps } from './nav-button';
import Image from 'next/image';
import useIsTablet from '@/lib/hooks/useIsTablet';
import LoginButton from './login-button';
import { UAParser } from 'ua-parser-js';
import MobileNavbar from './mobile-navbar';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';

export default function Navbar() {
	const router = useRouter();
	const pathname = usePathname();
	const isHome = pathname === '/';

	const device = UAParser().device;
	const isMobile = device.type === 'mobile';
	const isTablet = useIsTablet();
	const isLeftSideBarVisible = useIsLeftSideVisible();

	const navButtonProps: NavButtonProps[] = [
		{ href: '/news?q=전체', content: '뉴스' },
		{ href: '/board?q=전체', content: '클럽 커뮤니티' },
		!isLeftSideBarVisible ? { href: '/ranking', content: '랭킹' } : null,
	];

	const handleLogoClick = () => {
		router.push('/');
	};

	return isMobile ? (
		<MobileNavbar />
	) : (
		<header className={`${isHome ? 'bg-black-000' : 'bg-black-800'} sticky transition-colors ease-out`}>
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
					{navButtonProps.map((props) => props && <NavButton key={props.href} {...props} />)}
				</nav>
				{(pathname === '/signup' || isTablet) && <LoginButton />}
			</div>
		</header>
	);
}
