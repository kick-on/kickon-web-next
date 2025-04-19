'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LoginButton from './login-button';
import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';

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

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		setIsBgVisible(!isBgVisible);
	};

	return (
		<>
			<header className="sticky z-50 transition-colors ease-out">
				<div className={clsx('relative h-16 px-4 grid grid-cols-3 justify-between items-center', bgColor)}>
					<button onClick={toggleMenu} className={isHome ? '' : 'invert'}>
						<Image src={'/hamburger.svg'} alt="메뉴 아이콘" width={24} height={24} />
					</button>
					<Link href="/" className="w-auto h-full flex justify-center">
						<Image src={'/logo/icon-red.svg'} alt="킥온 로고 이미지" width={45} height={36} />
					</Link>
					<LoginButton />
				</div>
			</header>

			<div
				className={clsx(
					'fixed z-40 top-0 left-0 w-full h-full transition-colors',
					isBgVisible ? 'bg-black/40' : 'bg-transparent',
				)}
			>
				<nav
					className={clsx(
						'fixed top-16 z-50 w-full  transition-transform ease-in flex flex-col border-t rounded-b-lg body3-regular',
						bgColor,
						isHome ? 'text-black-900 border-black-200' : 'text-black-000 border-black-700',
						!isMenuOpen ? '-translate-y-full' : '',
					)}
				>
					{navButtons.map((button) => (
						<Link
							onClick={toggleMenu}
							key={button.content}
							href={button.herf}
							className={clsx('grow h-16 flex justify-center items-center', {
								'text-primary-900 button2-semibold': button.isActive,
							})}
						>
							{button.content}
						</Link>
					))}
				</nav>
			</div>
		</>
	);
}
