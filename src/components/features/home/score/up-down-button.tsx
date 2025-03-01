import Image from 'next/image';

export default function UpDownButton({
	direction,
	onClick,
	ref,
}: {
	direction: 'up' | 'down';
	onClick: () => void;
	ref?: React.Ref<HTMLButtonElement>;
}) {
	const [src, alt] = direction === 'up' ? ['/chevron/score-up.svg', '증가'] : ['/chevron/score-down.svg', '감소'];

	return (
		<button
			ref={ref}
			onClick={onClick}
			className="group w-4 h-4 rounded-xs bg-black-000 hover:bg-black-700 active:bg-black-900 shadow-score-button disabled:pointer-events-none"
		>
			<Image
				width={16}
				height={16}
				src={src}
				alt={alt}
				className="hover:filter hover:brightness-0 hover:invert group-disabled:opacity-[23%]"
			/>
		</button>
	);
}
