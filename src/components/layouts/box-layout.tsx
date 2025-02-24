'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// 패딩이 동일한 페이지들을 조건부로 처리
const commonPaddingPages = new Set(['/page2', '/page3']);

const paddingMap: Record<string, string> = {
	'/signup': 'px-[10.125rem] py-[6.25rem]',
	'/page4': 'pt-[7.5rem] pb-14 px-[10.125rem]', // 프로필 설정 페이지
};

const WhiteBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pathname = usePathname();

	return (
		<div
			className={clsx(
				'bg-black-100 w-fit min-h-fit border border-black-300 border-solid rounded-[0.625rem] mt-4 m-auto',
				commonPaddingPages.has(pathname) ? 'pt-[1.875rem] pb-[6.25rem] px-4' : paddingMap[pathname] || 'p-5', // 조건부 패딩 적용
			)}
		>
			{children}
		</div>
	);
};

export default WhiteBox;
