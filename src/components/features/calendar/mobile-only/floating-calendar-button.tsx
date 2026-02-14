import Image from 'next/image';

interface FloatingCalendarButtonProps {
	onClick: () => void;
}

const FloatingCalendarButton = ({ onClick }: FloatingCalendarButtonProps) => {
	return (
		<div className="min-[1094px]:hidden mr-1">
			<button
				onClick={onClick}
				className="w-[3.625rem] h-[3.625rem] bg-white rounded-full @mobile:mr-[1px]
				transition-transform duration-200 ease-out
				shadow-[0_2px_5px_rgba(0,0,0,0.12),0_2px_5px_rgba(0,0,0,0.24)]
				active:scale-95"
			>
				<div className="flex items-center gap-2 px-[15px] w-full">
					<Image src="/calendar.png" width={28} height={28} alt="" />
				</div>
			</button>
		</div>
	);
};

export default FloatingCalendarButton;
