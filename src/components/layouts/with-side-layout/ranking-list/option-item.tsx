import Image from 'next/image';

export default function OptionItem({
	league,
	src,
	onClick,
}: {
	league: string;
	src: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
	return (
		<button onClick={onClick} value={league} className="w-full h-8 flex gap-4 items-center pl-6 body5-regular">
			<Image width={16} height={16} src={src} alt={league} />
			{league}
		</button>
	);
}
