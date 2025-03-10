import Image from 'next/image';

export default function OptionItem({
	content,
	src,
	onClick,
}: {
	content: string;
	src: string;
	onClick: (string) => void;
}) {
	return (
		<button
			onClick={() => onClick(content)}
			className="w-full h-8 flex gap-4 items-center pl-6 body5-regular text-black-900"
		>
			<Image width={16} height={16} src={src} alt={content} />
			{content}
		</button>
	);
}
