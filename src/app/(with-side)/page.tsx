'use client';

import PredictCard from '@/components/features/home/predict-card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const accessToken = searchParams.get('accessToken');

	if (accessToken) {
		localStorage.setItem('accessToken', accessToken);
		router.replace('/');

		// 뒤로 가기 히스토리를 없애기 위해 replaceState 사용
		window.history.replaceState(null, '', '/');
	}

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
				<PredictCard status="success" />
				<PredictCard status="fail" />
				<PredictCard status="unparticipated" />
			</div>
		</div>
	);
}
