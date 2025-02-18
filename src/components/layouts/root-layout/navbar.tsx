'use client';

import { usePathname, useRouter } from 'next/navigation';
import NavButton, { NavButtonProps } from './nav-button';
import Image from 'next/image';

export default function Navbar() {
	const router = useRouter();
	const pathname = usePathname();
	const isHome = pathname === '/';

	const navButtonProps: NavButtonProps[] = [
		{ href: '/news', content: '뉴스' },
		{ href: '/board', content: '클럽 커뮤니티' },
	];

	const onClickLogo = () => {
		router.push('/');
	};

	return (
		<header className={`${isHome ? 'bg-black-000' : 'bg-black-800'} sticky transition-colors ease-out`}>
			<div className="flex justify-between items-center h-[4.5rem] max-w-[85rem] m-auto">
				<nav className="flex items-center">
					<Image
						width={216}
						height={48}
						onClick={onClickLogo}
						className="px-6 py-3 ml-[1rem] mr-[4.125rem] box-content cursor-pointer"
						src={isHome ? '/logo-black.svg' : '/logo-white.svg'}
						alt="킥온"
					/>
					{navButtonProps.map((props) => (
						<NavButton key={props.href} {...props} />
					))}
				</nav>
				<button className="w-[5.5rem] h-[2.25rem] mr-[0.3438rem] border border-black-300 rounded-3xl bg-black-000 text-primary-900 button1-medium">
					로그인
				</button>
			</div>
		</header>
	);
}
