'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFound() {
	const router = useRouter();

	useEffect(() => {
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, []);

	return (
		// 화면 높이가 작을 때 버튼이 잘리지 않도록 간격 조정 기능 필요
		<div className="flex flex-col items-center h-fit mt-30">
			<div className="relative w-114 h-[20.4375rem] @mobile:w-70 @mobile:h-[12.5625rem] mb-[50px]">
				<Image src={'/not-found.svg'} alt="404 페이지 아이콘" fill className="w-auto h-auto object-contain" />
			</div>
			<h1 className="text-5xl @mobile:text-[32px] font-bold leading-[42px] mb-5 @mobile:mb-4">Page not found</h1>
			<span className="text-2xl @mobile:text-[13px] leading-[42px] mb-28 @mobile:mb-20">
				요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요.
			</span>
			<button
				onClick={() => router.replace('/')}
				className="w-45 h-[50px] flex justify-center items-center bg-black-900 rounded-full button1-medium text-black-000"
			>
				홈으로 이동하기
			</button>
		</div>
	);
}
