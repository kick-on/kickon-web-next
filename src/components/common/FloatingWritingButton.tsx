'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Icon from '../../../public/file.svg';

const FloatingWritingButton = () => {
	const initialTopPosition = 456; // 초기 버튼 위치
	const topMargin = 20; // 상단에 닿았을 때 여백

	const [buttonStyle, setButtonStyle] = useState({
		position: 'absolute' as 'absolute' | 'fixed',
		top: `${initialTopPosition}px`,
		left: '80vw',
		transform: 'translateX(-50%)',
	});

	// 상태 추적용 ref
	const isFixed = useRef(false);
	const lastScrollY = useRef(0);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;

			// 스크롤이 초기 위치를 지나갔을 때
			if (scrollY >= initialTopPosition - topMargin) {
				// 아직 fixed 상태가 아니라면 fixed로 변경
				if (!isFixed.current) {
					isFixed.current = true;
					setButtonStyle({
						position: 'fixed',
						top: `${topMargin}px`,
						left: '80vw',
						transform: 'translateX(-50%)',
					});
				}
			}
			// 스크롤이 초기 위치보다 위에 있을 때
			else {
				// 현재 fixed 상태라면 원래 위치로 돌아가기
				if (isFixed.current) {
					isFixed.current = false;
					setButtonStyle({
						position: 'absolute',
						top: `${initialTopPosition}px`,
						left: '80vw',
						transform: 'translateX(-50%)',
					});
				}
			}

			// 마지막 스크롤 위치 업데이트
			lastScrollY.current = scrollY;
		};

		// 초기 스크롤 위치 확인 및 설정
		handleScroll();

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<button
			className="z-50 flex items-center justify-center w-12 h-12 bg-black-700 text-white
                rounded-full shadow-lg overflow-hidden group transition-all duration-300 ease-out
                hover:w-[322px] hover:rounded-[50px]"
			style={buttonStyle}
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
