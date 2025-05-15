'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
	const searchParams = useSearchParams();
	const errorCode = searchParams.get('errorCode');
	const router = useRouter();

	useEffect(() => {
		const previousPage = sessionStorage.getItem('previousPage');

		// 에러 코드가 없으면 정상 로그인 -> 이전 페이지로 리디렉션
		// 에러 코드가 있으면 로그인 or 회원가입 실패 -> alert 후 이전 페이지로 리디렉션
		if (!errorCode) {
			router.replace(previousPage);
		} else if (errorCode === 'REJOIN_LIMIT') {
			router.replace(previousPage);
			alert('탈퇴 후 7일이 지나지 않아 재가입할 수 없습니다.');
		} else {
			router.replace(previousPage);
			alert('알 수 없는 오류가 발생했습니다.');
		}
	}, [errorCode, router]);
	return <></>;
}
