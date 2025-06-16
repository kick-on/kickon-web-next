import React from 'react';

type PostPinToggleProps = {
	onPinChange?: (isPinned: boolean) => void;
};

export const PostPinToggle = ({ onPinChange }: PostPinToggleProps) => {
	const handlePinToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		onPinChange?.(e.target.checked);
	};

	return (
		<div className="flex items-center gap-4 mt-5 mx-2 mb-20 px-4 py-2.5 rounded-md bg-primary-50">
			<input type="checkbox" id="pin-toggle" className="hidden peer" onChange={handlePinToggle} />
			<label
				htmlFor="pin-toggle"
				className="w-[1.125rem] h-[1.125rem] inline-block rounded border border-black-400 bg-transparent bg-center bg-no-repeat bg-[length:70%] peer-checked:bg-[url('/check.svg')] peer-checked:bg-primary-900 peer-checked:border-none cursor-pointer"
			></label>
			<label htmlFor="pin-toggle" className="text-black-900 body5-medium cursor-pointer @mobile:text-13">
				게시글 상단에 고정하기
			</label>
		</div>
	);
};
