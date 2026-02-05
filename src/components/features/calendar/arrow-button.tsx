import clsx from 'clsx';
import Image from 'next/image';

interface ArrowButtonProps {
	direction: 'prev' | 'next';
	onClick: (dir: 'prev' | 'next') => void;
	isVisible: boolean;
}

export const ArrowButton = ({ direction, onClick, isVisible }: ArrowButtonProps) => {
	const isPrev = direction === 'prev';

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => onClick(direction)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onClick(direction);
				}
			}}
			className={clsx(
				'absolute cursor-pointer transition-opacity duration-200 ease-out',
				isPrev ? 'mr-25' : 'ml-25',
				isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
			)}
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
