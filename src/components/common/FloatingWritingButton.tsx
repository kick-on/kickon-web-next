'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Icon from '../../../public/edit.svg';

const FloatingWritingButton = () => {
	const router = useRouter();
	const pathname = usePathname();

	const handleEditButtonClick = () => {
		if (pathname.startsWith('/news')) {
			router.push('/post/news');
		} else if (pathname.startsWith('/board')) {
			router.push('/post/board');
		} else {
			router.push('/');
		}
	};

	return (
		<button
			onClick={handleEditButtonClick}
			className="z-50 flex items-center w-[3.625rem] h-[3.625rem] fixed 
					  bottom-5 bg-black-700 text-white rounded-full shadow-lg 
					  overflow-hidden group transition-all duration-300 ease-in-out 
					  hover:w-[20.125rem] hover:pl-[3.75rem]"
		>
			<div className="flex items-center gap-2 px-4 w-full">
				<Image src={Icon} alt="아이콘" width={28} height={28} />
				<span className="button2-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
					새로운 글 작성하기
				</span>
			</div>
		</button>
	);
};

export default FloatingWritingButton;
