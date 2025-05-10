import { ReactNode } from 'react';

export default function ComponentFrame({
	isMain = false,
	className,
	children,
}: {
	isMain?: boolean;
	className?: string;
	children: ReactNode;
}) {
	const width = isMain ? 'w-[41.75rem]' : 'w-[20.125rem]';

	return (
		<div
			className={`flex flex-col ${width} @mobile:w-full @mobile:grow
				bg-black-000 border border-black-300 rounded-[0.625rem] ${className}`}
		>
			{children}
		</div>
	);
}
