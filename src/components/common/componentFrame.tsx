import { ReactNode } from 'react';

export default function ComponentFrame({ isMain = false, children }: { isMain?: boolean; children: ReactNode }) {
	const width = isMain ? 'w-[41.75rem]' : 'w-[20.125rem]';
	return (
		<div className={`flex flex-col ${width} bg-black-000 border border-black-300 rounded-[0.625rem]`}>{children}</div>
	);
}
