import Image from 'next/image';

export default function OptionItem({
	pk,
	nameKr,
	logoUrl,
	onClick,
}: {
	pk: number;
	nameKr: string;
	logoUrl: string;
	onClick: (number) => void;
}) {
	return (
		<button
			onClick={() => onClick(pk)}
			className="w-full h-8 flex gap-4 items-center pl-6 body5-regular text-black-900"
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
