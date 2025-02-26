'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Icon from '../../../public/edit.svg';

const FloatingWritingButton = () => {
	const initialTopPosition = 656; // 버튼 초기 위치
	const [buttonTop, setButtonTop] = useState(initialTopPosition);
	const [isVisible, setIsVisible] = useState(true); // 버튼 가시성 상태
	const lastScrollY = useRef(0);
	const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
	const isScrolling = useRef(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const scrollDiff = scrollY - lastScrollY.current;
			isScrolling.current = true;

			// 🔼 스크롤할 때 버튼이 위로 이동
			setButtonTop((prevTop) => {
				const newTop = prevTop - scrollDiff;

				// 버튼이 화면 밖으로 완전히 사라졌다면 숨김 처리
				if (newTop < -50 && isVisible) {
					setIsVisible(false);
				}

				return newTop;
			});

			// 🔽 스크롤 멈추면 버튼 복귀
			if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
			scrollTimeout.current = setTimeout(() => {
				isScrolling.current = false;

				// 스크롤이 멈추면 버튼을 다시 보이게 하고 위치 복구
				setIsVisible(true);
				setButtonTop(initialTopPosition);
			}, 500);

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
			className={`z-50 flex items-center h-12 w-12 bg-black-700 text-white
                rounded-full shadow-lg overflow-hidden group transition-all duration-300 ease-in-out
                hover:w-[322px] hover:rounded-[50px] hover:justify-center relative
                ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} // hidden 대신 opacity 사용
			style={{
				position: 'fixed',
				top: `${buttonTop}px`,
				left: '71.2vw', // 왼쪽 위치 고정
				width: '48px', // 기본 상태 (아이콘 크기)
				transition: 'width 0.3s ease-in-out, top 0.5s ease-out, opacity 0.3s ease-out',
			}}
			onMouseEnter={(e) => (e.currentTarget.style.width = '322px')} // 호버 시 확장
			onMouseLeave={(e) => (e.currentTarget.style.width = '48px')} // 벗어나면 축소
		>
			{/* 아이콘만 보이는 기본 상태 */}
			<div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
				<Image src={Icon} alt="아이콘" className="w-6 h-6 min-w-6" />
			</div>

			{/* 호버 시 나타나는 텍스트와 아이콘 (중앙 정렬) */}
			<div className="flex items-center gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full justify-center">
				<Image src={Icon} alt="아이콘" className="w-6 h-6 min-w-6" />
				<span className="whitespace-nowrap">새로운 글 작성하기</span>
			</div>
		</button>
	);
};

export default FloatingWritingButton;
