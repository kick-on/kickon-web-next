'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const paddingMap: Record<string, string> = {
	'/signup': 'py-[6.25rem]',
	'/post/news': 'px-4',
	'/post/board': 'px-4',
	'/page4': 'pt-[7.5rem] pb-14', // 프로필 설정 페이지
};

const WhiteBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pathname = usePathname();

	const computedPadding = clsx(
		paddingMap[pathname] || 'p-5', // 기존 매핑된 패딩 적용
		!paddingMap[pathname]?.includes('pt-') && 'pt-[1.875rem]', // pt가 없으면 기본값 적용
		!paddingMap[pathname]?.includes('pb-') && 'pb-[6.25rem]', // pb가 없으면 기본값 적용
	);

	return (
		<div
			className={clsx(
				'flex bg-black-100 w-[41.75rem] h-auto border border-black-300 border-solid rounded-[0.625rem] mt-4 m-auto',
				'bg-black-000 w-[41.75rem] h-auto border border-black-300 border-solid rounded-[0.625rem] mt-4 m-auto',
				computedPadding,
			)}
		>
			{children}
		</div>
	);
};

export default WhiteBox;
