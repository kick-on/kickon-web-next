'use client';

import { useEffect, useState } from 'react';

export default function useIsLeftSideVisible() {
	const [isLeftSideVisible, setIsLeftSideVisible] = useState<boolean>(() =>
		typeof window !== 'undefined' ? window.innerWidth >= 1094 : false,
	);

	useEffect(() => {
		const handleResize = () => {
			setIsLeftSideVisible(window.innerWidth >= 1094);
		};

		window.addEventListener('resize', handleResize);
		// 초기에도 한번 체크
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return isLeftSideVisible;
}
