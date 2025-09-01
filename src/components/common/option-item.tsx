'use client';

import { getServerDeviceType } from '@/lib/utils';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export interface Option {
	pk: number;
	nameKr: string;
	logoUrl: string;
}

export default function OptionItem({
	pk,
	nameKr,
	logoUrl,
	onClick,
}: Option & {
	onClick: (number) => void;
}) {
	const pathname = usePathname();
	const isPost = pathname.startsWith('/post');
	const { isDesktop } = getServerDeviceType();

	return (
		<button
			onClick={() => onClick(pk)}
			className={clsx(
				'w-full flex gap-4 items-center px-6 text-body-05 text-black-900 whitespace-nowrap',
				isPost ? 'h-9' : `${isDesktop ? 'h-9' : 'h-[2.875rem]'}`,
			)}
		>
			<Image
				className="w-4 h-4 object-contain"
				unoptimized
				width={16}
				height={16}
				src={logoUrl}
				alt={`${nameKr} 로고`}
			/>
			{nameKr}
		</button>
	);
}
