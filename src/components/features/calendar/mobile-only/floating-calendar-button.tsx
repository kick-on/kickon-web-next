import Image from 'next/image';

const FloatingCalendarButton = () => {
	return (
		<div
			className="min-[1094px]:hidden w-fit h-fit z-30 flex items-center sticky
				bottom-15 ml-auto -mr-[5.125rem] max-[848px]:mr-4"
		>
			<button
				onClick={() => {}}
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
