import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavButton as NavButtonType } from '.';

export default function NavButton({ href, content, isActive }: NavButtonType) {
	const pathname = usePathname();

	return (
		<Link
			href={href}
			className={clsx('w-[9.375rem] tablet:w-[146px] h-[4.5rem] flex items-center justify-center nav1-medium', {
				'text-black-900': pathname === '/',
				'text-black-000': pathname !== '/' && isActive,
				'text-black-600': !isActive,
			})}
		>
			{content}
		</Link>
	);
}
