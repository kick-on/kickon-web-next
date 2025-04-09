'use client';

import { useEffect } from 'react';

export default function BackgroundHandler() {
	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	return <></>;
}
