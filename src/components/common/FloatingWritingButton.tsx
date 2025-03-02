'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Icon from '../../../public/edit.svg';

const FloatingWritingButton = () => {
	const [buttonTop, setButtonTop] = useState(856);
	const lastScrollY = useRef(0);
	const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
	const isHidden = useRef(false); // 버튼이 화면 밖으로 나갔는지 여부

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const scrollDiff = scrollY - lastScrollY.current;

			// 버튼이 화면 안에 있을 때만 이동
			setButtonTop((prevTop) => {
				const newTop = prevTop - scrollDiff;

				// 버튼이 화면 위로 완전히 사라지면 숨김 상태로 설정
				if (newTop < -50) {
					isHidden.current = true;
				} else {
					isHidden.current = false;
				}

				return newTop;
			});

			// 스크롤 멈춤 감지 (디바운싱)
			if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
			scrollTimeout.current = setTimeout(() => {
				if (window.scrollY === 0) {
					// 맨 위에 있을 경우 원래 위치 유지
					setButtonTop(856);
				} else if (isHidden.current) {
					// 화면 밖으로 사라진 경우 -> 50px로 이동
					setButtonTop(50);
				}
				// 화면 안에 있을 경우 -> 기존 위치 유지 (변경 X)
			}, 300);

			lastScrollY.current = scrollY;
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
		};
	}, []);

	return (
		<button
			className="z-50 flex items-center h-12 w-12 bg-black-700 text-white
                rounded-full shadow-lg overflow-hidden group transition-all duration-300 ease-in-out
                hover:w-[322px] hover:rounded-[50px] hover:justify-center relative"
			style={{
				position: 'fixed',
				top: `${buttonTop}px`,
				left: '71.2vw',
				width: '48px',
				transition: 'width 0.3s ease-in-out, top 0.5s ease-out',
			}}
			onMouseEnter={(e) => (e.currentTarget.style.width = '322px')}
			onMouseLeave={(e) => (e.currentTarget.style.width = '48px')}
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
