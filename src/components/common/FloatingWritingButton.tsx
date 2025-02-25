'use client';

import Image from 'next/image';
import Icon from '../../../public/file.svg';

const FloatingWritingButton = () => {
	return (
		<button
			className="fixed z-50 flex items-center justify-center w-12 h-12 bg-black-700 text-white 
                 rounded-full shadow-lg overflow-hidden group transition-all duration-300 ease-out 
                 hover:w-[322px] hover:rounded-[50px]"
			style={{
				top: '456px', // 고정된 위치
				left: '80vw', // 8:2 비율
				transform: 'translateX(-50%)',
			}}
		>
			<div className="flex items-center justify-center gap-2 w-full">
				<Image src={Icon} alt="아이콘" className="w-6 h-6" />
				<span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					새로운 글 작성하기
				</span>
			</div>
		</button>
	);
};

export default FloatingWritingButton;
