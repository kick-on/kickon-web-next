import { useCallback, useEffect, useState } from 'react';

export const GRID_BREAKPOINTS = [
	{ maxWidth: 767, columns: 2, rows: 4 },
	{ maxWidth: 1094, columns: 3, rows: 4 },
	{ maxWidth: 1440, columns: 4, rows: 5 },
];

// rows: 한 번에 보여줄 row 수 (기본값 5)
export const useFetchSize = (rows: number = 5) => {
	const getFetchSize = useCallback(() => {
		if (typeof window === 'undefined') return GRID_BREAKPOINTS[0]!.columns * rows;

		const width = window.innerWidth;
		const found = GRID_BREAKPOINTS.find((bp) => width <= bp.maxWidth);

		return found ? found.columns * found.rows : 5 * rows;
	}, [rows]);

	const [size, setSize] = useState(() => getFetchSize());

	useEffect(() => {
		let timeout: NodeJS.Timeout | null = null;

		const handleResize = () => {
			if (timeout) clearTimeout(timeout);

			timeout = setTimeout(() => {
				setSize(() => getFetchSize());
			}, 300); // 300ms debounce
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
			handleResize();
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('resize', handleResize);
			}

			if (timeout) clearTimeout(timeout);
		};
	}, [getFetchSize, rows]);

	return size;
};
