'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LoginButton from '../login-button';
import Link from 'next/link';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import MobileProfile from './mobile-profile';
import SideBar from './side-bar';

export function Divider() {
	return <hr className="m-4 border-black-200" />;
}

export default function MobileNavbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isBgVisible, setIsBgVisible] = useState(false);

	const pathname = usePathname();
	const isHome = pathname === '/';
	const bgColor = isHome ? 'bg-black-000' : 'bg-black-800';

	const navButtons = [
		{ herf: '/', content: '홈', isActive: pathname === '/' },
		{ herf: '/news?q=전체', content: '뉴스', isActive: pathname.split('/').includes('news') },
		{ herf: '/board?q=전체', content: '클럽 커뮤니티', isActive: pathname.split('/').includes('board') },
		{ herf: '/ranking', content: '랭킹', isActive: pathname === '/ranking' },
	];

	const handleToggleMenu = useCallback(() => {
		if (isMenuOpen) {
			setIsMenuOpen(!isMenuOpen);
			setTimeout(() => setIsBgVisible(!isBgVisible), 200);
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

			<SideBar side="left" isMenuOpen={isMenuOpen} isBgVisible={isBgVisible} handleToggleMenu={handleToggleMenu}>
				<MobileProfile />

				{navButtons.map((button) => (
					<Link
						onClick={handleToggleMenu}
						key={button.content}
						href={button.herf}
						className={clsx('w-full py-2.5 px-[1.375rem] active:bg-black-200 transition-colors', {
							'text-primary-900 button2-semibold': button.isActive,
						})}
					>
						{button.content}
					</Link>
				))}

				<Divider />
				<Link
					onClick={handleToggleMenu}
					href={'/profile-setting'}
					className={clsx('w-full py-2.5 px-[1.375rem] active:bg-black-200 transition-colors', {
						'text-primary-900 button2-semibold': pathname === '/profile-setting',
					})}
				>
					프로필 설정
				</Link>
			</SideBar>
		</>
	);
}
