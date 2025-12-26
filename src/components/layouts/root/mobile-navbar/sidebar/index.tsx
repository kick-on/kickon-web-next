'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function Sidebar({
	children,
	side,
	isMenuOpen,
	isBgVisible,
	handleToggleMenu,
}: {
	children: React.ReactNode;
	side: 'left' | 'right';
	isMenuOpen: boolean;
	isBgVisible: boolean;
	handleToggleMenu: () => void;
}) {
	const sideBarRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!isBgVisible) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (!sideBarRef.current.contains(event.target as Node)) {
				handleToggleMenu();
			}
		};
		document.addEventListener('click', handleClickOutside);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.body.style.overflow = '';
		};
	}, [handleToggleMenu, isBgVisible]);

	return (
		<div
			className={clsx(
				'fixed z-40 top-0 left-0 w-full h-full transition-colors',
				isMenuOpen ? 'bg-black/40' : 'bg-transparent',
				isBgVisible ? 'visible' : 'hidden -z-10',
			)}
		>
			<div
				ref={sideBarRef}
				className={clsx(
					`fixed top-0 z-50 w-[40%] max-w-[28.5625rem] min-w-[15.9375rem] h-full flex flex-col p-4
					body3-regular text-black-900 bg-black-000 transition-transform ease-in`,
					side === 'left' ? 'left-0' : 'right-0',
					!isMenuOpen ? (side === 'left' ? '-translate-x-full' : 'translate-x-full') : '',
				)}
			>
				<button aria-label={'사이드바 닫기'} onClick={handleToggleMenu} className="ml-auto mb-8 w-fit brightness-0">
					<Image aria-hidden={true} src={'/x/white.svg'} alt={''} width={24} height={24} />
				</button>
				{children}
			</div>
		</div>
	);
}
