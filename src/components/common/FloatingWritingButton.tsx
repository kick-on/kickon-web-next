'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Icon from '../../../public/file.svg';

const FloatingWritingButton = () => {
	const initialTopPosition = 456;
	const stepHeight = 60;
	const topMargin = 20;

	const [buttonStyle, setButtonStyle] = useState({
		position: 'absolute' as 'absolute' | 'fixed',
		top: `${initialTopPosition}px`,
		left: '80vw',
		transform: 'translateX(-50%)',
	});

	// 상태 추적용 ref
	const isFixed = useRef(false);
	const lastTriggerPoint = useRef(0);
	const isTransitioning = useRef(false);
	const currentFixedTop = useRef(initialTopPosition);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			if (isTransitioning.current) return;

			// 아직 fixed가 아닐 때
			if (!isFixed.current) {
				if (scrollTop > initialTopPosition - topMargin) {
					isFixed.current = true;
					isTransitioning.current = true;
					lastTriggerPoint.current = scrollTop;

					setButtonStyle((prev) => ({
						...prev,
						position: 'fixed',
						top: `${initialTopPosition}px`,
					}));

					setTimeout(() => {
						setButtonStyle((prev) => ({
							...prev,
							top: `${topMargin}px`,
						}));
						currentFixedTop.current = topMargin;

						setTimeout(() => {
							isTransitioning.current = false;
						}, 200);
					}, 200);
				}
			}
			// fixed 상태일 때
			else {
				if (scrollTop < initialTopPosition - topMargin) {
					isFixed.current = false;
					isTransitioning.current = true;

					setButtonStyle({
						position: 'absolute',
						top: `${initialTopPosition}px`,
						left: '80vw',
						transform: 'translateX(-50%)',
					});

					setTimeout(() => {
						isTransitioning.current = false;
					}, 300);
				} else if (scrollTop > lastTriggerPoint.current + stepHeight) {
					isTransitioning.current = true;
					lastTriggerPoint.current = scrollTop;

					const nextTop = currentFixedTop.current + stepHeight;
					setButtonStyle((prev) => ({
						...prev,
						top: `${nextTop}px`,
					}));
					currentFixedTop.current = nextTop;

					setTimeout(() => {
						isTransitioning.current = false;
					}, 300);
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

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
