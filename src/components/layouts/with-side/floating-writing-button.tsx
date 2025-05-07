'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Icon from '../../../../public/edit.svg';

const FloatingWritingButton = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const fullUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

	const handleEditButtonClick = () => {
		sessionStorage.setItem('previousPage', fullUrl);

		if (pathname.startsWith('/news')) {
			router.push('/post/news');
		} else if (pathname.startsWith('/board')) {
			router.push('/post/board');
		} else {
			router.push('/');
		}
	};

	if (pathname === '/') return null;

	return (
		<div
			className="desktop:w-[20.125rem] w-fit h-fit z-30 flex items-center sticky transition-all
				bottom-15 ml-auto -mb-[20.125rem] desktop:-mr-[21.625rem] -mr-[5.125rem] min-[1094px]:max-[1200px]:mr-4 max-[848px]:mr-4"
		>
			<button
				onClick={handleEditButtonClick}
				className="w-[3.625rem] h-[3.625rem] bg-black-700 text-white rounded-full shadow-lg 
				overflow-hidden group transition-all duration-300 ease-in-out 
				desktop:hover:w-[20.125rem] desktop:hover:pl-[3.75rem] @mobile:mr-[1px]"
			>
				<div className="flex items-center gap-2 px-[15px] w-full">
					<Image src={Icon} alt="아이콘" width={28} height={28} className="min-w-7" />
					<span className="button2-semibold whitespace-nowrap opacity-0 desktop:group-hover:opacity-100 transition-opacity">
						새로운 글 작성하기
					</span>
				</div>
			</button>
		</div>
	);
};

export default FloatingWritingButton;
