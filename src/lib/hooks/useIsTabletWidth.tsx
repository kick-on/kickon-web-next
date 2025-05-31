'use client';

import { useEffect, useState } from 'react';

export default function useIsTabletWidth() {
	const [isTabletWidth, setIsTabletWidth] = useState<boolean>(() =>
		typeof window !== 'undefined' ? window.innerWidth <= 1440 : false,
	);

	useEffect(() => {
		const handleResize = () => {
			setIsTabletWidth(window.innerWidth <= 1440);
		};

		window.addEventListener('resize', handleResize);
		// 초기에도 한번 체크
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return isTabletWidth;
}
