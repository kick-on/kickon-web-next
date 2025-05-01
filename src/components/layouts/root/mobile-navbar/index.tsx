'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LoginButton from '../login-button';
import Link from 'next/link';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import Sidebar from './sidebar';
import SideNavbar from './sidebar/side-navbar';
import SideProfile from './sidebar/side-profile';

export default function MobileNavbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isMenuBgVisible, setIsMenuBgVisible] = useState(false);
	const [isProfileBgVisible, setIsProfileBgVisible] = useState(false);

	const pathname = usePathname();
	const isHome = pathname === '/';
	const bgColor = isHome ? 'bg-black-000' : 'bg-black-800';

	const handleToggleMenu = useCallback(() => {
		if (isMenuOpen) {
			setTimeout(() => {
				setIsMenuOpen(false);
				setTimeout(() => setIsMenuBgVisible(false), 200);
			}, 200);
		} else {
			setIsMenuBgVisible(true);
			setTimeout(() => setIsMenuOpen(true), 10);
		}
	}, [isMenuOpen]);

	const handleToggleProfile = useCallback(() => {
		if (isProfileOpen) {
			setTimeout(() => {
				setIsProfileOpen(false);
				setTimeout(() => setIsProfileBgVisible(false), 200);
			}, 200);
		} else {
			setIsProfileBgVisible(true);
			setTimeout(() => setIsProfileOpen(true), 10);
		}
	}, [isProfileOpen]);

	return (
		<>
			<header className="fixed w-full top-0 z-40 transition-colors ease-out">
				<div className={clsx('relative h-16 px-4 grid grid-cols-3 justify-between items-center', bgColor)}>
					<button onClick={handleToggleMenu} className={`w-fit ${isHome ? '' : 'invert'}`}>
						<Image src={'/hamburger.svg'} alt="메뉴 아이콘" width={24} height={24} />
					</button>
					<Link href="/" className="w-auto h-full flex justify-center">
						<Image src={'/logo/icon-red.svg'} alt="킥온 로고 이미지" width={45} height={36} />
					</Link>
					<LoginButton onClickProfile={handleToggleProfile} />
				</div>
			</header>

			<Sidebar side={'left'} isMenuOpen={isMenuOpen} isBgVisible={isMenuBgVisible} handleToggleMenu={handleToggleMenu}>
				<SideNavbar onClickButton={handleToggleMenu} />
			</Sidebar>

			<Sidebar
				side={'right'}
				isMenuOpen={isProfileOpen}
				isBgVisible={isProfileBgVisible}
				handleToggleMenu={handleToggleProfile}
			>
				<SideProfile onClickButton={handleToggleProfile} />
			</Sidebar>
		</>
	);
}
