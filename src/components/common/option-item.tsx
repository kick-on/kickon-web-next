import Image from 'next/image';

export default function OptionItem({
	pk,
	krName,
	logoUrl,
	onClick,
}: {
	pk: number;
	krName: string;
	logoUrl: string;
	onClick: (number) => void;
}) {
	return (
		<button
			onClick={() => onClick(pk)}
			className="w-full h-8 flex gap-4 items-center pl-6 body5-regular text-black-900"
		>
			<Image width={16} height={16} src={logoUrl} alt={`${krName} 로고`} />
			{krName}
		</button>
	);
}
