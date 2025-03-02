import clsx from 'clsx';
import { ReactNode } from 'react';

export default function ComponentFrame({
	isMain = false,
	hasBorder = true,
	children,
}: {
	isMain?: boolean;
	hasBorder?: boolean;
	children: ReactNode;
}) {
	const width = isMain ? 'w-[678px]' : 'w-[322px]';
	return (
		<div className={clsx('flex flex-col bg-black-000 rounded-[10px]', width, { 'border border-black-300': hasBorder })}>
			{children}
		</div>
	);
}
