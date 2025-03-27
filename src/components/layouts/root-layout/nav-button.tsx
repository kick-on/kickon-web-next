import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavButtonProps {
	href: string;
	content: string;
}

export default function NavButton({ href, content }: NavButtonProps) {
	const pathname = usePathname();
	const isActive = pathname.split('/').includes(content === '뉴스' ? 'news' : 'board');

	return (
		<Link
			href={href}
			className={clsx('w-[9.375rem] h-[4.5rem] flex items-center justify-center nav1-medium', {
				'text-black-900': pathname === '/',
				'text-black-000': pathname === '/signup' || isActive,
				'text-black-600': (pathname.startsWith('/news') || pathname.startsWith('/board')) && !isActive,
			})}
		>
			{content}
		</Link>
	);
}
