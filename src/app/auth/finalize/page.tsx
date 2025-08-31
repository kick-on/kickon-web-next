'use client';

import useAuthStore from '@/lib/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
	const searchParams = useSearchParams();
	const errorCode = searchParams.get('errorCode');
	const router = useRouter();

	const { getToken } = useAuthStore();

	useEffect(() => {
		const previousPage = sessionStorage.getItem('previousPage');

		if (!errorCode) {
			// 에러 코드가 없으면 access token을 zustand에 저장
			getToken();
		} else if (errorCode === 'REJOIN_LIMIT') {
			alert('탈퇴 후 7일이 지나지 않아 재가입할 수 없습니다.');
		} else {
			alert('알 수 없는 오류가 발생했습니다.');
		}

		// 이전 페이지로 이동
		router.replace(previousPage);
	}, [errorCode, router, getToken]);

	return <></>;
}
