'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const paddingMap: Record<string, string> = {
	'/signup': 'py-[6.25rem] @mobile:pt-15',
	'/post/news': 'pt-[1.875rem] @mobile:mt-20',
	'/post/board': 'pt-[1.875rem] @mobile:mt-20',
	'/profile-setting': 'py-[8.25rem] @mobile:pt-15',
	'/withdrawal': 'py-[6.25rem] @mobile:pt-15',
};

const WhiteBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pathname = usePathname();
	const isNaked = pathname === '/signup' || pathname === '/profile-setting' || pathname === '/withdrawal';

	return (
		<div
			className={clsx(
				`flex w-[41.75rem] h-auto m-auto mt-4 px-4 bg-black-000 border border-black-300 rounded-[0.625rem]
				@mobile:w-auto @mobile:grow @mobile:mx-4`,
				paddingMap[pathname] || 'pt-5',
				{
					'@mobile:bg-transparent @mobile:border-0 @mobile:pb-0': isNaked,
				},
			)}
		>
			{children}
		</div>
	);
};

export default WhiteBox;
