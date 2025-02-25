import { ReactNode } from 'react';

export default function ComponentFrame({ isMain = false, children }: { isMain?: boolean; children: ReactNode }) {
	const width = isMain ? 'w-[678px]' : 'w-[322px]';
	return <div className={`flex flex-col ${width} bg-black-000 border border-black-300 rounded-[10px]`}>{children}</div>;
}
