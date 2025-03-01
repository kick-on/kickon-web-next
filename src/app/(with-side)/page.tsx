'use client';

import PredictButton from '@/components/features/home/predict-button';
import { useEffect } from 'react';

export default function Home() {
	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	return (
		<>
			<PredictButton />
		</>
	);
}
