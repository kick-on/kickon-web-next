'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const commonPaddingPages = new Set(['/page2', '/page3']);

const paddingMap: Record<string, string> = {
	'/signup': 'py-[6.25rem]',
	'/page4': 'pt-[7.5rem] pb-14', // 프로필 설정 페이지
};

const WhiteBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pathname = usePathname();

	const computedPadding = commonPaddingPages.has(pathname)
		? 'pt-[1.875rem] pb-[6.25rem]'
		: paddingMap[pathname] || 'p-5';

	return (
		<div
			className={clsx(
				'bg-black-100 w-[41.75rem] h-auto border border-black-300 border-solid rounded-[0.625rem] mt-4 m-auto',
				computedPadding,
			)}
		>
			{children}
		</div>
	);
};

export default WhiteBox;
