import clsx from 'clsx';
import Image from 'next/image';

export default function OptionItem({
	pk,
	nameKr,
	logoUrl,
	onClick,
	height = 'h-8',
}: {
	pk: number;
	nameKr: string;
	logoUrl: string;
	onClick: (number) => void;
	height?: string; // 유틸리티 클래스 전달
}) {
	return (
		<button
			onClick={() => onClick(pk)}
			className={clsx('w-full flex gap-4 items-center px-6 body5-regular text-black-900 whitespace-nowrap', height)}
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
