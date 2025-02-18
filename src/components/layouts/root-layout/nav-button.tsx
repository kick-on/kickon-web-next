import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavButtonProps {
	href: string;
	content: string;
}

export default function NavButton({ href, content }: NavButtonProps) {
	const pathname = usePathname();
	const isHome = pathname === '/';

	return (
		<Link
			href={href}
			className={`w-[9.375rem] h-[4.5rem] flex items-center justify-center ${isHome ? 'text-black-900' : 'text-black-000'}`}
		>
			{content}
		</Link>
	);
}
