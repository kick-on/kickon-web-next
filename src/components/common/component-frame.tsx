import { ReactNode } from 'react';

export default function ComponentFrame({
	isMain = false,
	isMobile = false,
	children,
}: {
	isMain?: boolean;
	isMobile?: boolean;
	children: ReactNode;
}) {
	const width = (() => {
		if (isMobile) {
			return 'w-auto mx-4';
		} else {
			return isMain ? 'w-[41.75rem]' : 'w-[20.125rem]';
		}
	})();
	return (
		<div className={`flex flex-col ${width} bg-black-000 border border-black-300 rounded-[0.625rem]`}>{children}</div>
	);
}
