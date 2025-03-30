'use client';

import PredictCard from '@/components/features/home/predict-card';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserInfo } from '@/services/auth';
import { useEffect } from 'react';

export default function Home() {
	const { setCurrentUserInfo } = useCurrentUserInfoStore();

	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		// jwt 기반으로 유저 정보 불러와 전역 상태 관리
		const getCurrentUserInfo = async () => {
			const response = await getUserInfo();

			if (typeof response === 'string') {
				console.log(response);
			} else {
				console.log(response.data);
				setCurrentUserInfo(response.data);
			}
		};

		getCurrentUserInfo();

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, [setCurrentUserInfo]);

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
