'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { setCookie } from '@/lib/utils/cookie';
import { getUserInfo } from '@/services/auth';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
	const router = useRouter();
	const pathParams = useParams();
	const searchParams = useSearchParams();
	const provider = pathParams?.provider;

	const { setCurrentUserInfo } = useCurrentUserInfoStore();

	useEffect(() => {
		const errorCode = searchParams.get('errorCode');

		// errorCode가 있는 경우 alert 후 홈으로 리디렉션
		if (errorCode === 'FORBIDDEN_RESISTER') {
			router.replace('/');
			alert('탈퇴 후 7일이 지나지 않아 재가입할 수 없습니다.');
		} else {
			// errorCode가 없는 경우에만 가입 또는 로그인 진행
			const accessToken = searchParams.get('accessToken');
			const refreshToken = searchParams.get('refreshToken');

			if (accessToken && refreshToken) {
				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);
			}

			const getCurrentUserInfo = async () => {
				const response = await getUserInfo();

				if (typeof response === 'string') {
					// 유저 정보 불러오기 실패(401/403) 시 회원가입 페이지로
					setCookie('fromLogin', 'true', 30);
					router.replace(`/signup?provider=${provider}`);
				} else {
					// 유저 정보 불러오기 성공 시 이전 페이지로
					setCurrentUserInfo(response.data);
					const previousPage = sessionStorage.getItem('previousPage');
					router.replace(previousPage);
				}
			};

			getCurrentUserInfo();
		}
	}, [router, searchParams, setCurrentUserInfo, provider]);
}
