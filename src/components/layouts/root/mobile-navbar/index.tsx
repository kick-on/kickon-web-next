'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LoginButton from '../login-button';
import Link from 'next/link';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import Sidebar from './sidebar';
import SideNavbar from './sidebar/side-navbar';

export default function MobileNavbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isBgVisible, setIsBgVisible] = useState(false);

	const pathname = usePathname();
	const isHome = pathname === '/';
	const bgColor = isHome ? 'bg-black-000' : 'bg-black-800';

	const handleToggleMenu = useCallback(() => {
		if (isMenuOpen) {
			setTimeout(() => {
				setIsMenuOpen(!isMenuOpen);
				setTimeout(() => setIsBgVisible(!isBgVisible), 200);
			}, 200);
		} else {
			setIsBgVisible(!isBgVisible);
			setTimeout(() => setIsMenuOpen(!isMenuOpen), 10);
		}
	}, [isBgVisible, isMenuOpen]);

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
					<LoginButton />
				</div>
			</header>

			<Sidebar side="left" isMenuOpen={isMenuOpen} isBgVisible={isBgVisible} handleToggleMenu={handleToggleMenu}>
				<SideNavbar onClickButton={handleToggleMenu} />
			</Sidebar>
		</>
	);
}
