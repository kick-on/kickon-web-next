import { ReactNode } from 'react';

export default function ComponentFrame({ isMain = false, children }: { isMain?: boolean; children: ReactNode }) {
	const width = isMain ? 'w-[41.75rem]' : 'w-[20.125rem]';

	return (
		<div
			className={`flex flex-col ${width} @mobile:w-auto @mobile:grow @mobile:mx-4
				bg-black-000 border border-black-300 rounded-[0.625rem]`}
		>
			{children}
		</div>
	);
}
