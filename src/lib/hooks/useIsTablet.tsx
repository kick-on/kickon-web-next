'use client';

import { useEffect, useState } from 'react';

export default function useIsTablet() {
	const [isTablet, setIsTablet] = useState<boolean>(() =>
		typeof window !== 'undefined' ? window.innerWidth <= 1440 : false,
	);

	useEffect(() => {
		const handleResize = () => {
			setIsTablet(window.innerWidth <= 1440);
		};

		window.addEventListener('resize', handleResize);
		// 초기에도 한번 체크
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return isTablet;
}
