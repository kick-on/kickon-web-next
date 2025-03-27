import Image from 'next/image';

export default function OptionItem({
	pk,
	name,
	logoUrl,
	onClick,
}: {
	pk: number;
	name: string;
	logoUrl: string;
	onClick: (number) => void;
}) {
	return (
		<button
			onClick={() => onClick(pk)}
			className="w-full h-8 flex gap-4 items-center pl-6 body5-regular text-black-900"
		>
			<Image width={16} height={16} src={logoUrl} alt={`${name} 로고`} />
			{name}
		</button>
	);
}
