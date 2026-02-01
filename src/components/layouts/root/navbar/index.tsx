'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import useIsTabletWidth from '@/lib/hooks/useIsTabletWidth';
import MobileNavbar from '../mobile-navbar';
import useIsLeftSideVisible from '@/lib/hooks/useIsLeftSideVisible';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import RightButtons from './right-buttons';
import Link from 'next/link';

export interface NavButton {
	href: string;
	content: string;
	isActive: boolean;
}

export default function Navbar() {
	const pathname = usePathname();
	const isHome = pathname === '/';

	const isDesktop = useIsDesktop();
	const isTabletWidth = useIsTabletWidth();
	const isLeftSideBarVisible = useIsLeftSideVisible();

	const navButtons = [
		{ href: '/', content: '홈', isActive: pathname === '/' },
		{ href: '/gamble', content: '승부예측', isActive: pathname.includes('/gamble') },
		{ href: '/news?q=전체', content: '뉴스', isActive: pathname.includes('/news') },
		{ href: '/board?q=전체', content: '클럽 커뮤니티', isActive: pathname.includes('/board') },
		{ href: '/halftime', content: '하프타임', isActive: pathname.includes('/halftime') },
		{ href: '/ranking', content: '랭킹', isActive: pathname.includes('/ranking') },
	];

	const filteredNavButtons = navButtons.filter((button) => {
		// isLeftSideBarVisible이 true일 때 홈/랭킹 버튼 숨김
		if (isLeftSideBarVisible && (button.href === '/' || button.href === '/ranking')) {
			return false;
		}
		return true;
	});

	if (!isDesktop === null) return null;

	// 모바일, 태블릿, 데스크톱에서 width가 충분히 작은 경우 MobileNavbar
	return !isDesktop || !isLeftSideBarVisible ? (
		<MobileNavbar navButtons={navButtons} />
	) : (
		<header className={`${isHome ? 'bg-black-000' : 'bg-black-800'} sticky z-30 transition-colors ease-out`}>
			<div className="flex justify-between items-center h-[4.5rem] max-w-[85rem] min-w-[48rem] max-[1094px]:w-[48rem] max-[1440px]:w-[62.5rem] m-auto">
				<nav className="flex items-center">
					<Link
						className="px-6 py-3 ml-[1rem] mr-[4.125rem] tablet:px-2.5 tablet:mx-0 box-content"
						href={'/'}
						aria-label={'홈으로 이동'}
					>
						<Image
							aria-hidden={true}
							width={216}
							height={48}
							src={isHome ? '/logo/kick-on-black.svg' : '/logo/kick-on-white.svg'}
							alt=""
						/>
					</Link>

					{/*{filteredNavButtons.map((props) => (*/}
					{/*	<NavButton key={props.content} {...props} />*/}
					{/*))}*/}
				</nav>
				<RightButtons isTabletWidth={isTabletWidth} />
			</div>
		</header>
	);
}
