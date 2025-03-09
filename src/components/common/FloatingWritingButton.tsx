'use client';

import Image from 'next/image';
import Icon from '../../../public/edit.svg';

const FloatingWritingButton = () => {
	return (
		<button
			className="z-50 flex items-center w-[3.625rem] h-[3.625rem] fixed top-214 left-[calc(100vw-37rem)]
              bg-black-700 text-white rounded-full shadow-lg overflow-hidden group
              transition-all duration-300 ease-in-out hover:w-[322px] hover:pl-[4.75rem]"
		>
			<div className="flex items-center gap-2 pl-3 w-full">
				<Image src={Icon} alt="아이콘" width={24} height={24} />
				<span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
					새로운 글 작성하기
				</span>
			</div>
		</button>
	);
};

export default FloatingWritingButton;
