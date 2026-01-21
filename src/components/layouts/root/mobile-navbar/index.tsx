'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import Sidebar from './sidebar';
import SideNavbar from './sidebar/side-navbar';
import { default as SideProfile } from '../navbar/profile';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { NavButton } from '../navbar';
import { isFullScreen } from '@/lib/utils';
import RightButtons from '../navbar/right-buttons';
import useIsMobile from '@/lib/hooks/useIsMobile';

export default function MobileNavbar({ navButtons }: { navButtons: NavButton[] }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isMenuBgVisible, setIsMenuBgVisible] = useState(false);
	const [isProfileBgVisible, setIsProfileBgVisible] = useState(false);

	const { currentUserInfo } = useCurrentUserInfoStore();

	const pathname = usePathname();
	const isHome = pathname === '/';
	const bgColor = isHome ? 'bg-black-000' : 'bg-black-800';

	const handleToggleMenu = useCallback(() => {
		if (isMenuOpen) {
			setIsMenuOpen(false);
			setTimeout(() => setIsMenuBgVisible(false), 200);
		} else {
			setIsMenuBgVisible(true);
			setTimeout(() => setIsMenuOpen(true), 10);
		}
	}, [isMenuOpen]);

	const handleToggleProfile = useCallback(() => {
		if (isProfileOpen) {
			setIsProfileOpen(false);
			setTimeout(() => setIsProfileBgVisible(false), 200);
		} else {
			setIsProfileBgVisible(true);
			setTimeout(() => setIsProfileOpen(true), 10);
		}
	}, [isProfileOpen]);

	// 모바일 화면에서만 내비게이션바 감춤
	const isMobile = useIsMobile();
	if (isMobile && isFullScreen(pathname)) {
		return null;
	}

	return (
		<>
			<header className="fixed w-full top-0 z-40 transition-colors ease-out">
				<div className={clsx('relative h-16 px-4 grid grid-cols-3 justify-between items-center', bgColor)}>
					<button aria-label={'메뉴'} onClick={handleToggleMenu} className={`w-fit ${isHome ? '' : 'invert'}`}>
						<Image aria-hidden={true} src={'/hamburger.svg'} alt="" width={24} height={24} />
					</button>
					<Link href="/" aria-label={'홈으로 이동'} className="w-auto h-full flex justify-center">
						<Image aria-hidden={true} src={'/logo/icon-red.svg'} alt="" width={45} height={36} />
					</Link>
					<RightButtons isMobile={true} onClickProfile={handleToggleProfile} />
				</div>
			</header>

			<Sidebar side={'left'} isMenuOpen={isMenuOpen} isBgVisible={isMenuBgVisible} handleToggleMenu={handleToggleMenu}>
				<SideNavbar onClickButton={handleToggleMenu} navButtons={navButtons} />
			</Sidebar>

			{currentUserInfo && (
				<Sidebar
					side={'right'}
					isMenuOpen={isProfileOpen}
					isBgVisible={isProfileBgVisible}
					handleToggleMenu={handleToggleProfile}
				>
					<SideProfile onClickButton={handleToggleProfile} />
				</Sidebar>
			)}
		</>
	);
}
