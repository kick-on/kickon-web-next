'use client';

import Image from 'next/image';
import Icon from '../../../public/edit.svg';

const FloatingWritingButton = () => {
	return (
		<button
			className="z-50 flex items-center h-12 w-12 fixed top-214 left-[calc(100vw-37rem)]
                bg-black-700 text-white rounded-full shadow-lg overflow-hidden group
                transition-all duration-300 ease-in-out hover:w-[322px] hover:rounded-[50px] hover:justify-center"
		>
			{/* 아이콘만 보이는 기본 상태 */}
			<div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
				<Image src={Icon} alt="아이콘" className="w-6 h-6 min-w-6" />
			</div>

			{/* 호버 시 나타나는 텍스트와 아이콘 */}
			<div className="flex items-center gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full justify-center">
				<Image src={Icon} alt="아이콘" className="w-6 h-6 min-w-6" />
				<span className="whitespace-nowrap">새로운 글 작성하기</span>
			</div>
		</button>
	);
};

export default FloatingWritingButton;
