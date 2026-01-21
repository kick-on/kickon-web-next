import Image from 'next/image';

interface ArrowButtonProps {
	direction: 'prev' | 'next';
	onClick: (dir: 'prev' | 'next') => void;
	isVisible: boolean;
}

export const ArrowButton = ({ direction, onClick, isVisible }: ArrowButtonProps) => {
	if (!isVisible) return null;

	const isPrev = direction === 'prev';
	return (
		<div
			role="button"
			tabIndex={0}
			className={`absolute ${isPrev ? 'mr-25' : 'ml-25'} cursor-pointer`}
			onClick={() => onClick(direction)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onClick(direction);
				}
			}}
		>
			<Image
				src={`/chevron/calendar-${isPrev ? 'left' : 'right'}.svg`}
				alt=""
				width={24}
				height={24}
				className="w-6 h-6 @mobile:w-[18px] @mobile:h-[18px]"
			/>
		</div>
	);
};
