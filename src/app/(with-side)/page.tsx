'use client';

import PredictCard from '@/components/features/home/predict-card';
import { useEffect } from 'react';

export default function Home() {
	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4">
				<PredictCard status="inProgress" />
			</div>
			<hr className="mx-6 border-black-600" />
			<div className="flex flex-col gap-4">
				<PredictCard status="participated" />
				<PredictCard status="unParticipated" />
			</div>
		</div>
	);
}
