'use client';

import RecommendedContent from '@/components/common/recommendedContent';
import PredictCard from '@/components/features/home/predict-card';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserInfo } from '@/services/auth';
import { useEffect } from 'react';

export default function Home() {
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();

	useEffect(() => {
		// 저장된 유저 정보가 없으면 jwt 기반으로 유저 정보 불러와 전역 상태 관리
		if (!currentUserInfo) {
			const getCurrentUserInfo = async () => {
				const response = await getUserInfo();

				if (typeof response === 'string') {
					console.log(response);
				} else {
					setCurrentUserInfo(response.data);
				}
			};

			getCurrentUserInfo();
		}

		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, [currentUserInfo, setCurrentUserInfo]);

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
			<RecommendedContent mode={'뉴스'} />
			<RecommendedContent mode={'게시글'} />
		</div>
	);
}
