import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavButtonProps {
	href: string;
	content: string;
}

export default function NavButton({ href, content }: NavButtonProps) {
	const pathname = usePathname();
	const isActive = (() => {
		if (content === '뉴스') return pathname.split('/').includes('news');
		if (content === '클럽 커뮤니티') return pathname.split('/').includes('board');
		if (content === '랭킹') return pathname.split('/').includes('ranking');
	})();

	return (
		<Link
			href={href}
			className={clsx('w-[9.375rem] tablet:w-[146px] h-[4.5rem] flex items-center justify-center nav1-medium', {
				'text-black-900': pathname === '/',
				'text-black-000':
					(pathname !== '/' && !(pathname.startsWith('/news') || pathname.startsWith('/board'))) || isActive,
				'text-black-600':
					(pathname.startsWith('/news') ||
						pathname.startsWith('/board') ||
						pathname.startsWith('/post') ||
						pathname.startsWith('/ranking')) &&
					!isActive,
			})}
		>
			{content}
		</Link>
	);
}
